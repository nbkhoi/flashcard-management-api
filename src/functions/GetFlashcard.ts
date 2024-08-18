import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function GetFlashcard(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const flashcardPartitionKey = request.params.flashcardPartitionKey;
    const flashcardRowKey = request.params.flashcardRowKey;
    return TableStorageHelper.getEntity('Flashcards', flashcardPartitionKey, flashcardRowKey).then((data) => {
        context.info(`Found flashcard with key: { partitionKey: ${flashcardPartitionKey}, rowKey: ${flashcardRowKey} }`);
        context.debug(`Flashcard: ${JSON.stringify(data)}`);
        return {
            status: 200,
            body: JSON.stringify(data)
        };
    }).catch((error) => {
        context.error(`Failed to get flashcard with key { partitionKey: ${flashcardPartitionKey}, rowKey: ${flashcardRowKey} }. Error: ${error}`);
        return {
            status: 500,
            body: JSON.stringify({ message: `Failed to get flashcard with key { partitionKey: ${flashcardPartitionKey}, rowKey: ${flashcardRowKey} }`,
                error: error
            })
        };
    });
};

app.http('GetFlashcard', {
    methods: ['GET', 'POST'],
    route: 'flashcards/{flashcardPartitionKey}/{flashcardRowKey}',
    authLevel: 'anonymous',
    handler: GetFlashcard
});
