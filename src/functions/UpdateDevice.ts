import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Device, DeviceEntity } from "../models/Devices";
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function UpdateDevice(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const devicePartitionKey = request.params.devicePartitionKey;
    const deviceRowKey = request.params.deviceRowKey;
    const data = await request.json() as Partial<Device>;
    const { deviceId, ...rest } = data;
    const existingDevice = await TableStorageHelper.getEntity('Devices', devicePartitionKey, deviceRowKey);
    if (!existingDevice) {
        context.error(`Device with partitionKey: ${devicePartitionKey} and rowKey: ${deviceRowKey} not found`);
        return {
            status: 404,
            body: JSON.stringify({
                message: `Device with partitionKey: ${devicePartitionKey} and rowKey: ${deviceRowKey} not found`
            })
        };
    } else if (deviceId !== existingDevice.deviceId) {
        context.error(`DeviceId must not be changed.`);
        return {
            status: 400,
            body: JSON.stringify({
                message: `DeviceId must not be changed.`
            })
        };
    } else {
        const updates: Partial<Device> = {
            ...rest
        };
        const updatedDevice = { ...existingDevice, ...updates } as DeviceEntity;
        return TableStorageHelper.updateEntity('Devices', updatedDevice).then(() => {
            context.info(`Device updated. Key: { partitionKey: '${devicePartitionKey}', rowKey: '${deviceRowKey}' }`);
            context.debug(`Updated device: ${JSON.stringify(updatedDevice)}`);
            return {
                status: 200,
                body: JSON.stringify(updatedDevice)
            };
        }).catch((error) => {
            context.error(`Update failed. Error: ${error}`);
            return {
                status: 500,
                body: JSON.stringify({
                    message: `Update failed`,
                    error: error
                })
            };
        });
    }    
};

app.http('UpdateDevice', {
    methods: ['PATCH'],
    route: 'devices/{devicePartitionKey}/{deviceRowKey}',
    authLevel: 'anonymous',
    handler: UpdateDevice
});
