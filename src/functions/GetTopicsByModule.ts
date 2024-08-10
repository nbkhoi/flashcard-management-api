import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function GetTopicsByModule(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const moduleRowKey = request.params.moduleRowKey;
    const partitionKey = moduleRowKey;
    return TableStorageHelper.getEntitiesByPartitionKey('Topics', partitionKey).then((data) => {
        context.info(`Found: ${data.length} topics`);
        return {
            status: 200,
            body: JSON.stringify(data)
        };
    }).catch((error) => {
        context.error(`Failed to get topics by module. Error: ${error}`);
        return {
            status: 500,
            body: JSON.stringify({ message: `Failed to get topics by module`,
                error: error
            })
        };
    });
};

app.http('GetTopicsByModule', {
    methods: ['GET'],
    route: 'topics/{moduleRowKey}',
    authLevel: 'anonymous',
    handler: GetTopicsByModule
});
