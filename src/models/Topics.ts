import { TableClient, TableEntity } from "@azure/data-tables";
import { ModuleEntity } from "./Modules";

export type Topic = {
    module: {
        partitionKey: string;
        rowKey: string;
        title: string;
    };
    title: string;
    description?: string;
    disabled?: boolean;
    isPremium?: boolean;
}

export type TopicEntity = TableEntity & Topic;