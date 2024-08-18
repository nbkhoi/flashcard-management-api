import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as uuid from 'uuid';
import { TableStorageHelper } from "../libs/TableStorageHelper";
import { DEFAULT_MODULE_PARTITION_KEY } from "../models/Constants";
import { Module, ModuleEntity } from "../models/Modules";
import { AccessTier } from "../models/Enums";
export async function CreateNewModule(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.info(`Http function processed request for url "${request.url}" with method "${request.method}"`);

    const data = await request.json() as Module;
    const title = data.title;
    const ordinal = data.ordinal??undefined;
    const accessTier = data.accessTier??AccessTier.COMMERCIAL;
    const disabled = data.disabled??false;
    const rowKey = uuid.v4();
    const moduleEntity: ModuleEntity = {
        partitionKey: DEFAULT_MODULE_PARTITION_KEY,
        rowKey,
        title: title,
        ordinal: ordinal,
        accessTier: accessTier,
        disabled: disabled,
        ...data
    };
    context.info(`Module creating...`);
    context.debug(`Module: ${JSON.stringify(moduleEntity)}`);
    return TableStorageHelper.saveEntity('Modules', moduleEntity).then(() => {
        context.info(`Module created. RowKey: ${rowKey}`);
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
