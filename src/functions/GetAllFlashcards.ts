import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableStorageHelper } from "../libs/TableStorageHelper";

export async function GetAllFlashcards(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    return TableStorageHelper.listEntities('Flashcards').then((data) => {
        context.info(`Found: ${data.length} flashcards`);
        return {
            status: 200,
            body: JSON.stringify(data)
        };
    }).catch((error) => {
        context.error(`Failed to get all flashcards. Error: ${error}`);
        return {
            status: 500,
            body: JSON.stringify({ message: `Failed to get all flashcards`,
                error: error
            })
        };
    });

};

app.http('GetAllFlashcards', {
    methods: ['GET'],
    route: 'flashcards',
    authLevel: 'anonymous',
    handler: GetAllFlashcards
});
