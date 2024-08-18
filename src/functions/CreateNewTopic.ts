import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as uuid from 'uuid';
import { TableStorageHelper } from "../libs/TableStorageHelper";
import { Topic } from "../models/Topics";
import { AccessTier } from "../models/Enums";

export async function CreateNewTopic(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const {module, ...topic} = await request.json() as Topic;
    const title = topic.title;
    const ordinal = topic.ordinal??undefined;
    const accessTier = topic.accessTier??AccessTier.COMMERCIAL;
    const disabled = topic.disabled??false;
    if (!module || !module.partitionKey || !module.rowKey) {
        const errMessage = `Topic must be associated with a module.`;
        context.error(errMessage);
        return { status: 400, body: JSON.stringify({ message: errMessage }) };
    }
    if (!title) {
        const errMessage = `Topic title is required.`;
        context.error(errMessage);
        return { status: 400, body: JSON.stringify({ message: errMessage
        }) };
    }
    const rowKey = uuid.v4();
    const topicEntity = {
        partitionKey: module.rowKey,
        rowKey,
        module: module.title,
        title: title,
        ordinal: ordinal,
        accessTier: accessTier,
        disabled: disabled,
        ...topic
    };
    context.info(`Topic creating...`);
    context.debug(`Topic: ${JSON.stringify(topicEntity)}`);
    return TableStorageHelper.saveEntity('Topics', topicEntity).then(() => {
        context.info(`Topic created. RowKey: ${rowKey}`);
        return {
            status: 201,
            body: JSON.stringify({
                message: "Topic created",
                partitionKey: topicEntity.partitionKey,
                rowKey: topicEntity.rowKey
            })
        };
    }).catch(err => {
        context.error(`Failed to create topic with error: ${err}`);
        return {
            status: 500,
            body: JSON.stringify({
                message: "Failed to create topic",
                error: err
            })
        };
    });
};

app.http('CreateNewTopic', {
    methods: ['POST'],
    route: 'topics',
    authLevel: 'anonymous',
    handler: CreateNewTopic
});
