import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function GetAllTopics(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    return TableStorageHelper.listEntities('Topics').then((data) => {
        context.info(`Found: ${data.length} topics`);
        return {
            status: 200,
            body: JSON.stringify(data)
        };
    }).catch((error) => {
        context.error(`Failed to get all topics. Error: ${error}`);
        return {
            status: 500,
            body: JSON.stringify({ message: `Failed to get all topics`,
                error: error
            })
        };
    });
};

app.http('GetAllTopics', {
    methods: ['GET'],
    route: 'topics',
    authLevel: 'anonymous',
    handler: GetAllTopics
});
