import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function DeleteTopic(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const topicRowKey = request.params.topicRowKey;
    const topicPartitionKey = request.params.topicPartitionKey;
    // Check if the topic exists
    const existingTopic = await TableStorageHelper.getEntity('Topics', topicPartitionKey, topicRowKey).then((data) => {
        context.info(`Topic found. Key: { partitionKey: '${topicPartitionKey}', rowKey: '${topicRowKey}' }`);
        context.debug(`Existing topic: ${JSON.stringify(existingTopic)}`);
        return data;
    });
    if (!existingTopic) {
        context.error(`Topic not found. Key: { partitionKey: '${topicPartitionKey}', rowKey: '${topicRowKey}' }`);
        return {
            status: 404,
            body: JSON.stringify({ message: `Topic not found. Key: { partitionKey: '${topicPartitionKey}', rowKey: '${topicRowKey}' }` })
        };
    } else {
        context.info(`Found. Topic deleting...`);
        return TableStorageHelper.deleteEntity('Topics', existingTopic).then(() => {
            context.info(`Topic deleted. Key: { partitionKey: '${topicPartitionKey}', rowKey: '${topicRowKey}' }`);
            return {
                status: 200,
                body: JSON.stringify({ message: `Topic deleted. Key: { partitionKey: '${topicPartitionKey}', rowKey: '${topicRowKey}' }` })
            };
        }).catch((error) => {
            context.error(`Delete failed. Error: ${error}`);
            return {
                status: 500,
                body: JSON.stringify({ message: `Delete failed.`,
                    error: error
                })
            };
        });
    }
};

app.http('DeleteTopic', {
    methods: ['DELETE'],
    route: 'topics/{topicPartitionKey}/{topicRowKey}',
    authLevel: 'anonymous',
    handler: DeleteTopic
});
