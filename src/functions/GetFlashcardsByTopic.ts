import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function GetFlashcardsByTopic(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const topicRowKey = request.params.topicRowKey;
    const partitionKey = topicRowKey;
    return TableStorageHelper.getEntitiesByPartitionKey('Flashcards', partitionKey).then((data) => {
        context.info(`Found: ${data.length} flashcards`);
        return {
            status: 200,
            body: JSON.stringify(data)
        };
    }).catch((error) => {
        context.error(`Failed to get flashcards by topic. Error: ${error}`);
        return {
            status: 500,
            body: JSON.stringify({ message: `Failed to get flashcards by topic`,
                error: error
            })
        };
    });
};

app.http('GetFlashcardsByTopic', {
    methods: ['GET'],
    route: 'flashcards/{topicRowKey}',
    authLevel: 'anonymous',
    handler: GetFlashcardsByTopic
});
