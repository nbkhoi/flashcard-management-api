import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";
import { ConsitencyHelper } from "../libs/ConsitencyHelper";

export async function DeleteFlashcard(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const flashcardPartitionKey = request.params.flashcardPartitionKey;
    const flashcardRowKey = request.params.flashcardRowKey;
    context.info(`Flashcard deleting...`);
    return TableStorageHelper.deleteEntity('Flashcards', flashcardPartitionKey, flashcardRowKey).then(() => {
        context.info(`Flashcard deleted. Key: { partitionKey: ${flashcardPartitionKey}, rowKey: ${flashcardRowKey} }`);
        ConsitencyHelper.updateTopicFlashcardCount(flashcardPartitionKey);
        return {
            status: 204
        };
    }).catch(err => {
        context.error(`Failed to delete flashcard with key: { partitionKey: ${flashcardPartitionKey}, rowKey: ${flashcardRowKey} }. Error: ${err}`);
        return {
            status: 500,
            body: JSON.stringify({
                message: "Failed to delete flashcard with key: { partitionKey: ${flashcardPartitionKey}, rowKey: ${flashcardRowKey} }",
                error: err
            })
        };
    });
};

app.http('DeleteFlashcard', {
    methods: ['DELETE'],
    route: 'flashcards/{flashcardPartitionKey}/{flashcardRowKey}',
    authLevel: 'anonymous',
    handler: DeleteFlashcard
});
