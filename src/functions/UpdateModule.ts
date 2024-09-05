import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Module, ModuleEntity } from "../models/Modules";
import { TableStorageHelper } from "../libs/TableStorageHelper";
import { DEFAULT_MODULE_PARTITION_KEY } from "../models/Constants";
import { TopicEntity } from "../models/Topics";
import { AccessTier } from "../models/Enums";

export async function UpdateModule(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const moduleRowKey = request.params.moduleRowKey;
    const modulePartitionKey = request.params.modulePartitionKey || DEFAULT_MODULE_PARTITION_KEY;
    const data = await request.json() as Partial<Module>;
    
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
    
    

    const existingModule = await TableStorageHelper.getEntity('Modules', modulePartitionKey, moduleRowKey).then((data) => {
        context.info(`Module found. RowKey '${moduleRowKey}'`);
        context.debug(`Existing module: ${JSON.stringify(data)}`);
        return data as ModuleEntity;
    });
    if (!existingModule) {
        context.error(`Module not found. Key: { partitionKey: '${modulePartitionKey}', rowKey: '${moduleRowKey}' }`);
        return {
            status: 404,
            body: JSON.stringify({ message: `Module not found. Key: { partitionKey: '${modulePartitionKey}', rowKey: '${moduleRowKey}' }` })
        };
    } else {
        const updates = {
            ...data
        };
        if ( 'title' in updates && updates.title !== existingModule.title ) {
            const topics = await TableStorageHelper.getEntitiesByPartitionKey('Topics', moduleRowKey) as TopicEntity[];
            for (const topic of topics) {
                const updatedTopic = { ...topic, module: updates.title };
                TableStorageHelper.updateEntity('Topics', updatedTopic);
                const flashcards = await TableStorageHelper.getEntitiesByPartitionKey('Flashcards', topic.rowKey) as TopicEntity[];
                for (const flashcard of flashcards) {
                    const updatedFlashcard = { ...flashcard, module: updates.title };
                    TableStorageHelper.updateEntity('Flashcards', updatedFlashcard);
                }
            }
        }
        if ( 'disabled' in updates && updates.disabled !== existingModule.disabled ) {
            const topics = await TableStorageHelper.getEntitiesByPartitionKey('Topics', moduleRowKey) as TopicEntity[];
            for (const topic of topics) {
                const updatedTopic = { ...topic, disabled: updates.disabled };
                TableStorageHelper.updateEntity('Topics', updatedTopic);
                const flashcards = await TableStorageHelper.getEntitiesByPartitionKey('Flashcards', topic.rowKey) as TopicEntity[];
                for (const flashcard of flashcards) {
                    const updatedFlashcard = { ...flashcard, disabled: updates.disabled };
                    TableStorageHelper.updateEntity('Flashcards', updatedFlashcard);
                }
            }
        }
        const updatedModule = { ...existingModule, ...updates } as ModuleEntity;
        return TableStorageHelper.updateEntity('Modules', updatedModule).then(() => {
            context.info(`Module updated. Key: { partitionKey: '${modulePartitionKey}', rowKey: '${moduleRowKey}' }`);
            context.debug(`Updated module: ${JSON.stringify(updatedModule)}`);
            return {
                status: 200,
                body: JSON.stringify(updatedModule)
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

app.http('UpdateModule', {
    methods: ['PATCH'],
    route: 'modules/{modulePartitionKey}/{moduleRowKey}',
    authLevel: 'anonymous',
    handler: UpdateModule
});
