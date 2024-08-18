import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";
import { DEFAULT_DEVICE_PARTITION_KEY } from "../models/Constants";
import * as uuid from 'uuid';
import { Device } from "../models/Devices";

export async function AddNewDevice(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const data = await request.json() as Device;
    const { deviceId, ...rest } = data;
    const isPremium = data.isPremium || false;
    const disabled = data.disabled || false;
    context.info(`Device creating...`);
    context.debug(`Device: ${JSON.stringify(data)}`);
    const deviceEntity = {
        partitionKey: DEFAULT_DEVICE_PARTITION_KEY,
        rowKey: uuid.v4(),
        deviceId,
        isPremium,
        disabled,
        ...rest
    };
    return TableStorageHelper.saveEntity('Devices', deviceEntity).then(() => {
        context.info(`Device created. Key: { partitionKey: '${deviceEntity.partitionKey}', rowKey: '${deviceEntity.rowKey}' }`);
        return {
            status: 201,
            body: JSON.stringify({
                message: "Device created",
                partitionKey: deviceEntity.partitionKey,
                rowKey: deviceEntity.rowKey
            })
        };
    }).catch(err => {
        context.error(`Failed to create device with error: ${err}`);
        return {
            status: 500,
            body: JSON.stringify({
                message: "Failed to create device",
                error: err
            })
        };
    });
};

app.http('AddNewDevice', {
    methods: ['POST'],
    route: 'devices',
    authLevel: 'anonymous',
    handler: AddNewDevice
});
