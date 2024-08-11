import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function GetDevice(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const devicePartitionKey = request.params.devicePartitionKey;
    const deviceRowKey = request.params.deviceRowKey;
    context.info(`Getting device with partitionKey: ${devicePartitionKey} and rowKey: ${deviceRowKey}`);
    return TableStorageHelper.getEntity('Devices', devicePartitionKey, deviceRowKey).then(device => {
        context.info(`Found device: ${device.deviceId}`);
        return {
            status: 200,
            body: JSON.stringify(device)
        };
    }).catch(err => {
        context.error(`Failed to get device with key: { partitionKey: '${devicePartitionKey}', rowKey: '${deviceRowKey}' }. Error: ${err}`);
        return {
            status: 500,
            body: JSON.stringify({
                message: "Failed to get device with key: { partitionKey: '${devicePartitionKey}', rowKey: '${deviceRowKey}' }",
                error: err
            })
        };
    });
};

app.http('GetDevice', {
    methods: ['GET'],
    route: 'devices/{devicePartitionKey}/{deviceRowKey}',
    authLevel: 'anonymous',
    handler: GetDevice
});
