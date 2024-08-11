import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function DeleteDevice(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const devicePartitionKey = request.params.devicePartitionKey;
    const deviceRowKey = request.params.deviceRowKey;
    const existingDevice = await TableStorageHelper.getEntity('Devices', devicePartitionKey, deviceRowKey);
    if (!existingDevice) {
        context.error(`Device not found. Key: { partitionKey: '${devicePartitionKey}', rowKey: '${deviceRowKey}' }`);
        return {
            status: 404,
            body: JSON.stringify({
                message: `Device not found. Key: { partitionKey: '${devicePartitionKey}', rowKey: '${deviceRowKey}' }`
            })
        };
    } else {
        return TableStorageHelper.deleteEntity('Devices', devicePartitionKey, deviceRowKey).then(() => {
            context.info(`Device deleted. Key: { partitionKey: '${devicePartitionKey}', rowKey: '${deviceRowKey}' }`);
            context.debug(`Deleted device: ${JSON.stringify(existingDevice)}`);
            return {
                status: 200,
                body: JSON.stringify(existingDevice)
            };
        }).catch((error) => {
            context.error(`Delete failed. Error: ${error}`);
            return {
                status: 500,
                body: JSON.stringify({
                    message: `Delete failed`,
                    error: error
                })
            };
        });
    }
};

app.http('DeleteDevice', {
    methods: ['DELETE'],
    route: 'devices/{devicePartitionKey}/{deviceRowKey}',
    authLevel: 'anonymous',
    handler: DeleteDevice
});
