import { TopicEntity } from "../models/Topics";
import { TableStorageHelper } from "./TableStorageHelper";

export const ConsitencyHelper = {
    async updateTopicFlashcardCount(topicRowKey: string, topicPartitionKey?: string): Promise<void> {
        const flashcards = await TableStorageHelper.getEntitiesByPartitionKey('Flashcards', topicRowKey) as TopicEntity[];
        const count = flashcards.length;
        let topic: TopicEntity;
        if (!topicPartitionKey) {
            topic = (await TableStorageHelper.queryEntities('Topics', `RowKey eq '${topicRowKey}'`) as TopicEntity[])[0];
        } else {
            topic = await TableStorageHelper.getEntity('Topics', topicPartitionKey, topicRowKey) as TopicEntity;
        }
        if (topic) {
            const updatedTopic = { ...topic, flashcardCount: count };
            TableStorageHelper.updateEntity('Topics', updatedTopic);
        }
    },
};