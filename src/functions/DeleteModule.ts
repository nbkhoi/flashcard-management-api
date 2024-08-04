import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";
import { DEFAULT_MODULE_PARTITION_KEY } from "../models/Constants";
export async function DeleteModule(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const rowKey = request.params.rowKey;
    // Check if the module exists
    const existingModule = await TableStorageHelper.getEntity('Modules', DEFAULT_MODULE_PARTITION_KEY, rowKey).then((data) => {
        context.info(`Module found. RowKey '${rowKey}'`);
        context.debug(`Existing module: ${JSON.stringify(existingModule)}`);
        return data;
    });
    if (!existingModule) {
        context.error(`Module not found. RowKey: ${rowKey}`);
        return {
            status: 404,
            body: JSON.stringify({ message: `Module not found. RowKey '${rowKey}'` })
        };
    } else {
        context.info(`Found. Module deleting...`);
        return TableStorageHelper.deleteEntity('Modules', existingModule).then(() => {
            context.info(`Module deleted. RowKey '${rowKey}'`);
            return {
                status: 200,
                body: JSON.stringify({ message: `Module deleted. RowKey '${rowKey}'` })
            };
        }).catch((error) => {
            context.error(`Delete failed. Error: ${error}`);
            return {
                status: 500,
                body: JSON.stringify({ message: `Delete failed`,
                    error: error
                })
            };
        });
    }
};

app.http('DeleteModule', {
    methods: ['DELETE'],
    route: 'modules/{rowKey}',
    authLevel: 'anonymous',
    handler: DeleteModule
});
