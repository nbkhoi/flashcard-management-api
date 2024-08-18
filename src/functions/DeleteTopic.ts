import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function DeleteTopic(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const topicRowKey = request.params.topicRowKey;
    const topicPartitionKey = request.params.topicPartitionKey;
    context.info(`Found. Topic deleting...`);
    return TableStorageHelper.deleteEntity('Topics', topicPartitionKey, topicRowKey).then(() => {
        context.info(`Topic deleted. Key: { partitionKey: '${topicPartitionKey}', rowKey: '${topicRowKey}' }`);
        return {
            status: 204
        };
    }).catch((error) => {
        context.error(`Failed to delete topic with key: { partitionKey: '${topicPartitionKey}', rowKey: '${topicRowKey}' }. Error: ${error}`);
        return {
            status: 500,
            body: JSON.stringify({
                message: `Failed to delete topic with key: { partitionKey: '${topicPartitionKey}', rowKey: '${topicRowKey}' }`,
                error: error
            })
        };
    });
};

app.http('DeleteTopic', {
    methods: ['DELETE'],
    route: 'topics/{topicPartitionKey}/{topicRowKey}',
    authLevel: 'anonymous',
    handler: DeleteTopic
});
