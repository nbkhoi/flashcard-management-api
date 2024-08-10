import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";
import { DEFAULT_MODULE_PARTITION_KEY } from "../models/Constants";
export async function DeleteModule(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const moduleRowKey = request.params.moduleRowKey;
    const modulePartitionKey = request.params.modulePartitionKey || DEFAULT_MODULE_PARTITION_KEY;
    // Check if the module exists
    const existingModule = await TableStorageHelper.getEntity('Modules', modulePartitionKey, moduleRowKey).then((data) => {
        context.info(`Module found. Key: { partitionKey: '${modulePartitionKey}', rowKey: '${moduleRowKey}' }`);
        context.debug(`Existing module: ${JSON.stringify(existingModule)}`);
        return data;
    });
    if (!existingModule) {
        context.error(`Module not found. Key: { partitionKey: '${modulePartitionKey}', rowKey: '${moduleRowKey}' }`);
        return {
            status: 404,
            body: JSON.stringify({ message: `Module not found. Key: { partitionKey: '${modulePartitionKey}', rowKey: '${moduleRowKey}' }` })
        };
    } else {
        context.info(`Found. Module deleting...`);
        return TableStorageHelper.deleteEntity('Modules', existingModule).then(() => {
            context.info(`Module deleted. Key: { partitionKey: '${modulePartitionKey}', rowKey: '${moduleRowKey}' }`);
            return {
                status: 200,
                body: JSON.stringify({ message: `Module deleted. Key: { partitionKey: '${modulePartitionKey}', rowKey: '${moduleRowKey}' }` })
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

app.http('DeleteModule', {
    methods: ['DELETE'],
    route: 'modules/{modulePartitionKey}/{moduleRowKey}',
    authLevel: 'anonymous',
    handler: DeleteModule
});
