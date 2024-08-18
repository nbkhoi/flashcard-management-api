import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function GetAllModules(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.info(`Http function processed request for url "${request.url}"`);
    return TableStorageHelper.listEntities('Modules').then((data) => {
        context.info(`Found: ${data.length} modules`);
        return {
            status: 200,
            body: JSON.stringify(data)
        };
    }).catch((error) => {
        context.error(`Failed to get all modules. Error: ${error}`);
        return {
            status: 500,
            body: JSON.stringify({ message: `Failed to get all modules`,
                error: error
            })
        };
    });

};

app.http('GetAllModules', {
    methods: ['GET'],
    route: 'modules',
    authLevel: 'anonymous',
    handler: GetAllModules
});
