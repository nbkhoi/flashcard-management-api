import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Module, ModuleEntity } from "../models/Modules";
import { TableStorageHelper } from "../libs/TableStorageHelper";
import { DEFAULT_MODULE_PARTITION_KEY } from "../models/Constants";

export async function UpdateModule(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const rowKey = request.params.rowKey;
    const data = await request.json() as Module;
    const title = data.title;
    const existingModule = await TableStorageHelper.getEntity('Modules', DEFAULT_MODULE_PARTITION_KEY, rowKey).then((data) => {
        context.info(`Module found. RowKey '${rowKey}'`);
        context.debug(`Existing module: ${JSON.stringify(existingModule)}`);
        return data as ModuleEntity;
    });
    if (!existingModule) {
        context.error(`Module not found. RowKey: ${rowKey}`);
        return {
            status: 404,
            body: JSON.stringify({ message: `Module not found. RowKey '${rowKey}'` })
        };
    } else {
        const updates: Partial<ModuleEntity> = {
            ...data
        };
        const updatedModule = { ...existingModule, ...updates } as ModuleEntity;
        return TableStorageHelper.updateEntity('Modules', updatedModule).then(() => {
            context.info(`Module updated. RowKey '${rowKey}'`);
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
    methods: ['PUT'],
    route: 'modules/{rowKey}',
    authLevel: 'anonymous',
    handler: UpdateModule
});
