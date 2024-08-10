import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";
import { DEFAULT_MODULE_PARTITION_KEY } from "../models/Constants";
export async function DeleteModule(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const moduleRowKey = request.params.moduleRowKey;
    const modulePartitionKey = request.params.modulePartitionKey || DEFAULT_MODULE_PARTITION_KEY;
    context.info(`Found. Module deleting...`);
    return TableStorageHelper.deleteEntity('Modules', modulePartitionKey, moduleRowKey).then(() => {
        context.info(`Module deleted. Key: { partitionKey: '${modulePartitionKey}', rowKey: '${moduleRowKey}' }`);
        return {
            status: 200,
            body: JSON.stringify({ message: `Module deleted. Key: { partitionKey: '${modulePartitionKey}', rowKey: '${moduleRowKey}' }` })
        };
    }).catch((error) => {
        context.error(`Failed to delete module with key: { partitionKey: '${modulePartitionKey}', rowKey: '${moduleRowKey}' }. Error: ${error}`);
        return {
            status: 500,
            body: JSON.stringify({
                message: `Failed to delete module with key: { partitionKey: '${modulePartitionKey}', rowKey: '${moduleRowKey}' }`,
                error: error
            })
        };
    });
};

app.http('DeleteModule', {
    methods: ['DELETE'],
    route: 'modules/{modulePartitionKey}/{moduleRowKey}',
    authLevel: 'anonymous',
    handler: DeleteModule
});
