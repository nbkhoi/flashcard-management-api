
import { TableClient, TableEntity } from '@azure/data-tables';
import { get } from 'http';

const connectionString = process.env.StorageConnectionString;

export const TableStorageHelper = {
    async saveEntity(table: string, entity: TableEntity): Promise<void> {
        const client = TableClient.fromConnectionString(connectionString, table);
        await client.createEntity(entity);
    },

    async listEntities(table: string): Promise<TableEntity[]> {
        const client = TableClient.fromConnectionString(connectionString, table);
        const entities = [];
        for await (const entity of client.listEntities()) {
            entities.push(entity);
        }
        return entities;
    },

    async getEntitiesByPartitionKey(table: string, partitionKey: string): Promise<TableEntity[]> {
        const client = TableClient.fromConnectionString(connectionString, table);
        const entities = [];
        for await (const entity of client.listEntities({ queryOptions: { filter: `PartitionKey eq '${partitionKey}'` } })) {
            entities.push(entity);
        }
        return entities
    },

    async getEntity(table: string, partitionKey: string, rowKey: string): Promise<TableEntity> {
        const client = TableClient.fromConnectionString(connectionString, table);
        return await client.getEntity(partitionKey, rowKey);
    },

    async queryEntities(table: string, query: string): Promise<TableEntity[]> {
        const client = TableClient.fromConnectionString(connectionString, table);
        const entities = [];
        for await (const entity of client.listEntities({ queryOptions: { filter: query } })) {
            entities.push(entity);
        }
        return entities;
    },

    async updateEntity(table: string, entity: TableEntity): Promise<void> {
        const client = TableClient.fromConnectionString(connectionString, table);
        await client.updateEntity(entity);
    },

    async deleteEntity(table: string, partitionKey: string, rowKey: string): Promise<void> {
        const client = TableClient.fromConnectionString(connectionString, table);
        await client.deleteEntity(partitionKey, rowKey);
    }
}