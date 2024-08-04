import { TableEntity } from "@azure/data-tables";

export type Module = {
    title: string;
    thumbnail?: string;
    description?: string;
    disabled?: boolean;
}

export type ModuleEntity = TableEntity & Module;