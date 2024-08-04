import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as modules from '../models/Modules';
import * as uuid from 'uuid';
import { TableStorageHelper } from "../libs/TableStorageHelper";
import { DEFAULT_MODULE_PARTITION_KEY } from "../models/Constants";
export async function CreateNewModule(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.info(`Http function processed request for url "${request.url}" with method "${request.method}"`);

    // Get the request body
    const data = await request.json() as modules.Module;
    const title = data.title;
    // Generate a new RowKey
    const rowKey = uuid.v4();
    const moduleEntity: modules.ModuleEntity = {
        partitionKey: DEFAULT_MODULE_PARTITION_KEY,
        rowKey,
        title: title,
        ...data
    };
    context.info(`Module creating...`);
    context.debug(`Module: ${JSON.stringify(moduleEntity)}`);
    return TableStorageHelper.saveEntity('Modules', moduleEntity).then(() => {
        context.info(`Module created. RowKey: ${rowKey}`);
        context.debug(`Module: ${JSON.stringify(moduleEntity)}`);
        return {
            status: 201,
            body: JSON.stringify({
                message: "Module created",
                partitionKey: moduleEntity.partitionKey,
                rowKey: moduleEntity.rowKey
            })
        };
    }).catch(err => {
        context.error(`Failed to create module with error: ${err}`);
        return {
            status: 500,
            body: JSON.stringify({
                message: "Failed to create module",
                error: err
            })
        };
    });
};

app.http('CreateNewModule', {
    methods: ['POST'],
    route: 'modules',
    authLevel: 'anonymous',
    handler: CreateNewModule
});
