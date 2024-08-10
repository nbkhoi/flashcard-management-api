import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Flashcard } from "../models/Flashcards";
import * as uuid from 'uuid';
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function CreateNewFlashcard(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const {module, topic, ...flashcard} = await request.json() as Flashcard;
    const word = flashcard.word;
    if (!module || !module.partitionKey || !module.rowKey) {
        const errMessage = `Flashcard must be associated with a module.`;
        context.error(errMessage);
        return { status: 400, body: JSON.stringify({ message: errMessage }) };
    }
    if (!topic || !topic.partitionKey || !topic.rowKey) {
        const errMessage = `Flashcard must be associated with a topic.`;
        context.error(errMessage);
        return { status: 400, body: JSON.stringify({ message: errMessage }) };
    }
    if (!word) {
        const errMessage = `Flashcard word is required.`;
        context.error(errMessage);
        return { status: 400, body: JSON.stringify({ message: errMessage }) };
    }
    const flashcardEntity = {
        partitionKey: topic.rowKey,
        rowKey: uuid.v4(),
        module: module.title,
        topic: topic.title,
        ...flashcard
    };
    context.info(`Flashcard creating...`);
    context.debug(`Flashcard: ${JSON.stringify(flashcardEntity)}`);
    return TableStorageHelper.saveEntity('Flashcards', flashcardEntity).then(() => {
        context.info(`Flashcard created. RowKey: ${flashcardEntity.rowKey}`);
        return {
            status: 201,
            body: JSON.stringify({
                message: "Flashcard created",
                partitionKey: flashcardEntity.partitionKey,
                rowKey: flashcardEntity.rowKey
            })
        };
    }).catch(err => {
        context.error(`Failed to create flashcard with error: ${err}`);
        return {
            status: 500,
            body: JSON.stringify({
                message: "Failed to create flashcard",
                error: err
            })
        };
    });
};

app.http('CreateNewFlashcard', {
    methods: ['POST'],
    route: 'flashcards',
    authLevel: 'anonymous',
    handler: CreateNewFlashcard
});
