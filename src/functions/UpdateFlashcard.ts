import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Flashcard, FlashcardEntity } from "../models/Flashcards";
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function UpdateFlashcard(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const flashcardPartitionKey = request.params.flashcardPartitionKey;
    const flashcardRowKey = request.params.flashcardRowKey;
    const data = await request.json() as Flashcard;
    const existingFlashcard = await TableStorageHelper.getEntity('Flashcards', flashcardPartitionKey, flashcardRowKey).then((data) => {
        context.info(`Flashcard found. RowKey '${flashcardRowKey}'`);
        context.debug(`Existing flashcard: ${JSON.stringify(data)}`);
        return data as FlashcardEntity;
    });
    if (!existingFlashcard) {
        context.error(`Flashcard not found. Key: { partitionKey: '${flashcardPartitionKey}', rowKey: '${flashcardRowKey}' }`);
        return {
            status: 404,
            body: JSON.stringify({ message: `Flashcard not found. Key: { partitionKey: '${flashcardPartitionKey}', rowKey: '${flashcardRowKey}' }` })
        };
    } else {
        const updates: Partial<FlashcardEntity> = {
            ...data
        };
        const updatedFlashcard = { ...existingFlashcard, ...updates } as FlashcardEntity;
        return TableStorageHelper.updateEntity('Flashcards', updatedFlashcard).then(() => {
            context.info(`Flashcard updated. Key: { partitionKey: '${flashcardPartitionKey}', rowKey: '${flashcardRowKey}' }`);
            context.debug(`Updated flashcard: ${JSON.stringify(updatedFlashcard)}`);
            return {
                status: 200,
                body: JSON.stringify(updatedFlashcard)
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

app.http('UpdateFlashcard', {
    methods: ['PATCH'],
    route: 'flashcards/{flashcardPartitionKey}/{flashcardRowKey}',
    authLevel: 'anonymous',
    handler: UpdateFlashcard
});
