import { app, InvocationContext } from "@azure/functions";
import { v4 as uuidv4 } from 'uuid';
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function PublishModule(blob: Buffer, context: InvocationContext): Promise<void> {
    context.log(`Storage blob function processed blob "${context.triggerMetadata.name}" with size ${blob.length} bytes`);
    // Read the blob content
    const blobContent = blob.toString('utf-8');
    // Parse the JSON content
    await ProcessBlob(blobContent, context);
}

// Define an async function that processes the blob and returns tuple of three objects
export async function ProcessBlob(string: string, context: InvocationContext): Promise<void> {
    const blobJson = JSON.parse(string);
    const { topics, ...moduleWithoutTopics } = blobJson;
    const ordinal = moduleWithoutTopics.ordinal?? 9999;
    const accessTier = moduleWithoutTopics.accessTier?? "commercial";
    const disabled = moduleWithoutTopics.disabled?? false;
    const moduleEntity = {
        partitionKey: 'DEFAULT',
        rowKey: uuidv4(),
        ...moduleWithoutTopics,
        ordinal: ordinal,
        accessTier: accessTier,
        disabled: disabled,
    };
    let topicOrdinals = 0;
    for (const topic of topics) {
        topicOrdinals++;
        const accessTier = "community" === moduleEntity.accessTier || topicOrdinals === 1 ? "community" : "commercial";
        const { cards, ...topicWithhoutCards } = topic;
        const topicEntity = {
            partitionKey: moduleEntity.rowKey,
            rowKey: uuidv4(),
            module: moduleWithoutTopics.title,
            ...topicWithhoutCards,
            ordinal: topicOrdinals,
            accessTier: accessTier,
            disabled: false,
            flashcardCount: 0
        };
        for (const card of cards) {
            const accessTier = "community" === topicEntity.accessTier || topicEntity.flashcardCount < 3 ? "community" : "commercial";
            const flashcardEntity = {
                partitionKey: topicEntity.rowKey,
                rowKey: uuidv4(),
                module: moduleWithoutTopics.title,
                topic: topic.title,
                ordinal: topicEntity.flashcardCount++,
                accessTier: accessTier,
                disabled: false,
                ...card
            };
            try {
                // context.log(`Processing flashcard: ${JSON.stringify(flashcardEntity)}`);
                await TableStorageHelper.saveEntity('Flashcards', flashcardEntity);
            } catch (error) {
                context.error(error.message);
                context.error(`Error processing flashcard: ${JSON.stringify(flashcardEntity)}`);
                return;
            }
        };
        try {
            // context.log(`Processing topic: ${JSON.stringify(topicEntity)}`);
            await TableStorageHelper.saveEntity('Topics', topicEntity);
        } catch (error) {
            context.error(error.message);
            context.error(`Error processing topic: ${JSON.stringify(topicEntity)}`);
            return;
        }
    }
    try {
        context.log(`Processing module: ${JSON.stringify(moduleEntity)}`);
        await TableStorageHelper.saveEntity('Modules', moduleEntity);
    } catch (error) {
        context.error(error.message);
        context.error(`Error processing module: ${JSON.stringify(moduleEntity)}`);
        return;
    }
}

app.storageBlob('PublishModule', {
    path: `${process.env.BLOB_CONTAINER_NAME}/{name}`,
    connection: 'AzureWebJobsStorage',
    handler: PublishModule
});
