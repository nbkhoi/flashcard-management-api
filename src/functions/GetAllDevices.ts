import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function GetAllDevices(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    return TableStorageHelper.listEntities('Devices').then(devices => {
        context.info(`Found: ${devices.length} devices`);
        return {
            status: 200,
            body: JSON.stringify(devices)
        };
    }).catch(err => {
        context.error(`Failed to get all devices with error: ${err}`);
        return {
            status: 500,
            body: JSON.stringify({
                message: "Failed to get all devices",
                error: err
            })
        };
    });
};

app.http('GetAllDevices', {
    methods: ['GET'],
    route: 'devices',
    authLevel: 'anonymous',
    handler: GetAllDevices
});
