import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";
import { DEFAULT_MODULE_PARTITION_KEY } from "../models/Constants";

export async function GetModule(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.info(`Http function processed request for url "${request.url}"`);
    const moduleRowKey = request.params.moduleRowKey;
    const modulePartitionKey = request.params.modulePartitionKey || DEFAULT_MODULE_PARTITION_KEY;
    return TableStorageHelper.getEntity('Modules', modulePartitionKey, moduleRowKey).then((data) => {
        context.info(`Found module with key. { partitionKey: '${modulePartitionKey}', rowKey: '${moduleRowKey}' }`);
        context.debug(`Module: ${JSON.stringify(data)}`);
        return {
            status: 200,
            body: JSON.stringify(data)
        };
    }).catch((error) => {
        context.error(`Failed to get module with key. { partitionKey: '${modulePartitionKey}', rowKey: '${moduleRowKey}' }. Error: ${
            error}`);
        return {
            status: 500,
            body: JSON.stringify({ message: `Failed to get module with key. { partitionKey: '${modulePartitionKey}', rowKey: '${moduleRowKey}' }`,
                error: error
            })
        };
    });
};

app.http('GetModule', {
    methods: ['GET'],
    route: 'modules/{modulePartitionKey}/{moduleRowKey}',
    authLevel: 'anonymous',
    handler: GetModule
});
