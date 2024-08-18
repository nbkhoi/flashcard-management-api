import { TableClient, TableEntity } from "@azure/data-tables";
import { ModuleEntity } from "./Modules";
import { AccessTier } from "./Enums";

export type Topic = {
    module: {
        partitionKey: string;
        rowKey: string;
        title: string;
    };
    title: string;
    description?: string;
    flashcardCount?: number;
    ordinal?: number;
    accessTier?: AccessTier;
    disabled?: boolean;
}

export type TopicEntity = TableEntity & Topic;