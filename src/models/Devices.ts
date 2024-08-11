import { TableEntity } from "@azure/data-tables";

export type Device = {
    deviceId: string;
    comment?: string;
    isPremium?: boolean;
    disabled?: boolean;
}

export type DeviceEntity = TableEntity & Device;