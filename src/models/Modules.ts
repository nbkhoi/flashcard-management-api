import { TableEntity } from "@azure/data-tables";
import { AccessTier } from "./Enums";

export type Module = {
    title: string;
    thumbnail?: string;
    description?: string;
    ordinal?: number;
    accessTier?: AccessTier;
    disabled?: boolean;
}

export type ModuleEntity = TableEntity & Module;