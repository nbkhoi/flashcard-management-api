import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function GetTopic(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const topicRowKey = request.params.topicRowKey;
    const topicPartitionKey = request.params.topicPartitionKey;
    return TableStorageHelper.getEntity('Topics', topicPartitionKey, topicRowKey).then((data) => {
        context.info(`Found topic with key. { partitionKey: '${topicPartitionKey}', rowKey: '${topicRowKey}' }`);
        context.debug(`Topic: ${JSON.stringify(data)}`);
        return {
            status: 200,
            body: JSON.stringify(data)
        };
    }).catch((error) => {
        context.error(`Failed to get topic with key. { partitionKey: '${topicPartitionKey}', rowKey: '${topicRowKey}' }. Error: ${error}`);
        return {
            status: 500,
            body: JSON.stringify({ message: `Failed to get topic with key. { partitionKey: '${topicPartitionKey}', rowKey: '${topicRowKey}' }`,
                error: error
            })
        };
    });
};

app.http('GetTopic', {
    methods: ['GET'],
    route: 'topics/{topicPartitionKey}/{topicRowKey}',
    authLevel: 'anonymous',
    handler: GetTopic
});
