# API Documentation

## API Endpoint

The base URL for the API is:

- Development:

  ```PlainText
  https://devflashcardmngtapifnapp.azurewebsites.net
  ```

- Production:

  ```PlainText
  https://prodflashcardmngtapifnapp.azurewebsites.net
  ```

## Get all modules

- Endpoint: `GET /api/modules`
- Description: Retrieves all modules.
- Response: JSON array containing all modules.

## Get a module by id

- Endpoint: `GET /api/modules/DEFAULT/{moduleRowKey}`
- Description: Retrieves a module by its id.
- Parameters:
  - `moduleRowKey`: The row key of the module.
- Response: JSON object representing the module.

## Create a module

- Endpoint: `POST /api/modules`
- Description: Creates a new module.
- Request body: JSON object containing the module data.
  {
    title: string;
    thumbnail?: string;       // URL to the thumbnail image
    description?: string;
    ordinal?: number;         // Ordinal number of the module.
    accessTier?: AccessTier;  // "community" or "commercial". Default is "commercial"
    disabled?: boolean;       // If the module is disabled. Default is false
  }
- Response: JSON object representing the created module.

## Update a module

- Endpoint: `PATCH /api/modules/{modulePartitionKey}/{moduleRowKey}`
- Description: Updates an existing module.
- Parameters:
  - `modulePartitionKey`: The partition key of the module.
  - `moduleRowKey`: The row key of the module.
- Request body: JSON object containing the updated module data.
- Response: JSON object representing the updated module.

## Delete a module

- Endpoint: `DELETE /api/modules/{modulePartitionKey}/{moduleRowKey}`
- Description: Deletes a module.
- Parameters:
  - `modulePartitionKey`: The partition key of the module.
  - `moduleRowKey`: The row key of the module.
- Response: No content.

## Get all topics for a module

- Endpoint: `GET /api/topics/{moduleRowKey}`
- Description: Retrieves all topics for a module.
- Parameters:
  - `moduleRowKey`: The row key of the module.
- Response: JSON array containing all topics for the module.

## Get a topic by id

- Endpoint: `GET /api/topics/{topicPartitionKey}/{topicRowKey}`
- Description: Retrieves a topic by its id.
- Parameters:
  - `topicPartitionKey`: The partition key of the topic.
  - `topicRowKey`: The row key of the topic.
- Response: JSON object representing the topic.

## Create a topic

- Endpoint: `POST /api/topics`
- Description: Creates a new topic.
- Request body: JSON object containing the topic data.
  {
      module: {
          partitionKey: string;
          rowKey: string;
          title: string;
      };
      title: string;
      description?: string;
      flashcardCount?: number;    // Number of flashcards in the topic. Always 0 when creating a new topic.
      ordinal?: number;           // Ordinal number of the topic.
      accessTier?: AccessTier;    // "community" or "commercial". Default is "commercial"
      disabled?: boolean;         // If the topic is disabled. Default is false
  }
- Response: JSON object representing the created topic.

## Update a topic

- Endpoint: `PATCH /api/topics/{topicPartitionKey}/{topicRowKey}`
- Description: Updates an existing topic.
- Parameters:
  - `topicPartitionKey`: The partition key of the topic.
  - `topicRowKey`: The row key of the topic.
- Request body: JSON object containing the updated topic data.
- Response: JSON object representing the updated topic.

## Delete a topic

- Endpoint: `DELETE /api/topics/{topicPartitionKey}/{topicRowKey}`
- Description: Deletes a topic.
- Parameters:
  - `topicPartitionKey`: The partition key of the topic.
  - `topicRowKey`: The row key of the topic.
- Response: No content.

## Get all flashcards for a topic

- Endpoint: `GET /api/flashcards/{topicRowKey}`
- Description: Retrieves all flashcards for a topic.
- Parameters:
  - `topicRowKey`: The row key of the topic.
- Response: JSON array containing all flashcards for the topic.

## Get a flashcard by id

- Endpoint: `GET /api/flashcards/{flashcardPartitionKey}/{flashcardRowKey}`
- Description: Retrieves a flashcard by its id.
- Parameters:
  - `flashcardPartitionKey`: The partition key of the flashcard.
  - `flashcardRowKey`: The row key of the flashcard.
- Response: JSON object representing the flashcard.

## Create a flashcard

- Endpoint: `POST /api/flashcards`
- Description: Creates a new flashcard.
- Request body: JSON object containing the flashcard data.
  {
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
      definition: string;
      ipaUk?: string;
      ipaUs?: string;
      pronUk?: string;
      pronUs?: string;
      meaningVi?: string;
      exampleSentence?: string;
      ordinal?: number;             // Ordinal number of the flashcard.
      accessTier?: AccessTier;      // "community" or "commercial". Default is "commercial"
      disabled?: boolean;           // If the flashcard is disabled. Default is false
  }
- Response: JSON object representing the created flashcard.

## Update a flashcard

- Endpoint: `PATCH /api/flashcards/{flashcardPartitionKey}/{flashcardRowKey}`
- Description: Updates an existing flashcard.
- Parameters:
  - `flashcardPartitionKey`: The partition key of the flashcard.
  - `flashcardRowKey`: The row key of the flashcard.
- Request body: JSON object containing the updated flashcard data.
- Response: JSON object representing the updated flashcard.

## Delete a flashcard

- Endpoint: `DELETE /api/flashcards/{flashcardPartitionKey}/{flashcardRowKey}`
- Description: Deletes a flashcard.
- Parameters:
  - `flashcardPartitionKey`: The partition key of the flashcard.
  - `flashcardRowKey`: The row key of the flashcard.
- Response: No content.

## Get all devices

- Endpoint: `GET /api/devices`
- Description: Retrieves all devices.
- Response: JSON array containing all devices.

## Get a device by id

- Endpoint: `GET /api/devices/DEFAULT/{deviceRowKey}`
- Description: Retrieves a device by its id.
- Parameters:
  - `deviceRowKey`: The row key of the device.
- Response: JSON object representing the device.

## Create a device

- Endpoint: `POST /api/devices`
- Description: Creates a new device.
- Request body: JSON object containing the device data.
  {
    deviceId: string;
    comment?: string;
    isPremium?: boolean;
    disabled?: boolean;
  }
- Response: JSON object representing the created device.

## Update a device

- Endpoint: `PATCH /api/devices/{devicePartitionKey}/{deviceRowKey}`
- Description: Updates an existing device.
- Parameters:
  - `devicePartitionKey`: The partition key of the device.
  - `deviceRowKey`: The row key of the device.
- Request body: JSON object containing the updated device data.
- Response: JSON object representing the updated device.

## Delete a device

- Endpoint: `DELETE /api/devices/{devicePartitionKey}/{deviceRowKey}`
- Description: Deletes a device.
- Parameters:
  - `devicePartitionKey`: The partition key of the device.
  - `deviceRowKey`: The row key of the device.
- Response: No content.
