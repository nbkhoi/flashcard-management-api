# API Documentation

## API Endpoint

The base URL for the API is:
  
  ```PlainText
  https://devflashcardmngtapifnapp.azurewebsites.net
  ```

## Get all modules

- Endpoint: `GET /api/modules`
- Description: Retrieves all modules.
- Response: JSON array containing all modules.

## Get a module by id

- Endpoint: `GET /api/modules/{modulePartitionKey}/{moduleRowKey}`
- Description: Retrieves a module by its id.
- Parameters:
  - `modulePartitionKey`: The partition key of the module.
  - `moduleRowKey`: The row key of the module.
- Response: JSON object representing the module.

## Create a module

- Endpoint: `POST /api/modules`
- Description: Creates a new module.
- Request body: JSON object containing the module data.
- Response: JSON object representing the created module.

## Update a module

- Endpoint: `PUT /api/modules/{modulePartitionKey}/{moduleRowKey}`
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
- Response: JSON object representing the created topic.

## Update a topic

- Endpoint: `PUT /api/topics/{topicPartitionKey}/{topicRowKey}`
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
- Response: JSON object representing the created flashcard.

## Update a flashcard

- Endpoint: `PUT /api/flashcards/{flashcardPartitionKey}/{flashcardRowKey}`
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
