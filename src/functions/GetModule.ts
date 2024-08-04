import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";
import { DEFAULT_MODULE_PARTITION_KEY } from "../models/Constants";

export async function GetModule(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.info(`Http function processed request for url "${request.url}"`);
    const rowKey = request.params.rowKey;
    return TableStorageHelper.getEntity('Modules', DEFAULT_MODULE_PARTITION_KEY, rowKey).then((data) => {
        context.info(`Found module with rowKey '${rowKey}'`);
        context.debug(`Module: ${JSON.stringify(data)}`);
        return {
            status: 200,
            body: JSON.stringify(data)
        };
    }).catch((error) => {
        context.error(`Failed to get module with rowKey '${rowKey}'. Error: ${error}`);
        return {
            status: 500,
            body: JSON.stringify({ message: `Failed to get module with rowKey '${rowKey}'`,
                error: error
            })
        };
    });
};

app.http('GetModule', {
    methods: ['GET'],
    route: 'modules/{rowKey}',
    authLevel: 'anonymous',
    handler: GetModule
});
