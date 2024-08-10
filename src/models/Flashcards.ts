import { TableEntity } from "@azure/data-tables";

export type Flashcard = {
    module: {
        partitionKey: string;
        rowKey: string;
        title: string;
    };
    topic: {
        partitionKey: string;
        rowKey: string;
        title: string;
    };
    word: string;
    partOfSpeech: string;
    ipaUk: string;
    ipaUs: string;
    pronUk: string;
    pronUs: string;
    definition: string;
    meaningVi: string;
    exampleSentence: string;
} 

export type FlashcardEntity = TableEntity & Flashcard;