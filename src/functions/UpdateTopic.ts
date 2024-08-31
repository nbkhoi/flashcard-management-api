import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Topic, TopicEntity } from "../models/Topics";
import { TableStorageHelper } from "../libs/TableStorageHelper";
import { AccessTier } from "../models/Enums";

export async function UpdateTopic(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const topicRowKey = request.params.topicRowKey;
    const topicPartitionKey = request.params.topicPartitionKey;
    const data = await request.json() as Partial<Topic>;
    
    if ( 'ordinal' in data ) {
        data.ordinal = parseInt(data.ordinal as unknown as string);
    }

    if ( 'accessTier' in data ) {
        if ( !Object.values(AccessTier).includes(data.accessTier as AccessTier) ) {
            context.error(`Invalid accessTier value: ${data.accessTier}`);
            return {
                status: 400,
                body: JSON.stringify({ message: `Invalid accessTier value: ${data.accessTier}` })
            };
        }
    }
    
    if ( 'disabled' in data ) {
        data.disabled = data.disabled as unknown === 'true';
    }

    const existingTopic = await TableStorageHelper.getEntity('Topics', topicPartitionKey, topicRowKey).then((data) => {
        context.info(`Topic found. RowKey '${topicRowKey}'`);
        context.debug(`Existing topic: ${JSON.stringify(data)}`);
        return data as TopicEntity;
    });
    if (!existingTopic) {
        context.error(`Topic not found. Key: { partitionKey: '${topicPartitionKey}', rowKey: '${topicRowKey}' }`);
        return {
            status: 404,
            body: JSON.stringify({ message: `Topic not found. Key: { partitionKey: '${topicPartitionKey}', rowKey: '${topicRowKey}' }` })
        };
    } else {
        const updates = {
            ...data
        };
        if ( 'title' in updates && updates.title !== existingTopic.title ) {
            const flashcards = await TableStorageHelper.getEntitiesByPartitionKey('Flashcards', topicRowKey) as TopicEntity[];
            for (const flashcard of flashcards) {
                const updatedFlashcard = { ...flashcard, topic: updates.title };
                TableStorageHelper.updateEntity('Flashcards', updatedFlashcard);
            }
        }
        const updatedTopic = { ...existingTopic, ...updates } as TopicEntity;
        return TableStorageHelper.updateEntity('Topics', updatedTopic).then(() => {
            context.info(`Topic updated. Key: { partitionKey: '${topicPartitionKey}', rowKey: '${topicRowKey}' }`);
            context.debug(`Updated topic: ${JSON.stringify(updatedTopic)}`);
            return {
                status: 200,
                body: JSON.stringify(updatedTopic)
            };
        }).catch((error) => {
            context.error(`Update failed. Error: ${error}`);
            return {
                status: 500,
                body: JSON.stringify({ message: `Update failed`,
                    error: error
                })
            };
        });
    }
};

app.http('UpdateTopic', {
    methods: ['PATCH'],
    route: 'topics/{topicPartitionKey}/{topicRowKey}',
    authLevel: 'anonymous',
    handler: UpdateTopic
});
