# Flashcard Management API Project

This project is a RESTful API for managing flashcards. It is built using Azure Functions and Azure Table Storage. The API allows users to create, read, update, and delete modules, topics and flashcards. The API also allows users to retrieve flashcards by module and topic.

## API Endpoints

The API has the following endpoints:

- `GET /api/modules` - Get all modules
- `GET /api/modules/{modulePartitionKey}/{moduleRowKey}` - Get a module by id
- `POST /api/modules` - Create a module
- `PUT /api/modules/{modulePartitionKey}/{moduleRowKey}` - Update a module
- `DELETE /api/modules/{modulePartitionKey}/{moduleRowKey}` - Delete a module
- `GET /api/topics/{moduleRowKey}` - Get all topics for a module
- `GET /api/topics/{topicPartitionKey}/{topicRowKey}` - Get a topic by id
- `POST /api/topics` - Create a topic
- `PUT /api/topics/{topicPartitionKey}/{topicRowKey}` - Update a topic
- `DELETE /api/topics/{topicPartitionKey}/{topicRowKey}` - Delete a topic
- `GET /api/flashcards/{topicRowKey}` - Get all flashcards for a topic
- `GET /api/flashcards/{flashcardPartitionKey}/{flashcardRowKey}` - Get a flashcard by id
- `POST /api/flashcards` - Create a flashcard
- `PUT /api/flashcards/{flashcardPartitionKey}/{flashcardRowKey}` - Update a flashcard
- `DELETE /api/flashcards/{flashcardPartitionKey}/{flashcardRowKey}` - Delete a flashcard

## Running the API locally

To run the API locally, you will need to have the Azure Functions Core Tools installed. You can install the tools using npm:

```bash
npm install -g azure-functions-core-tools
```

You will also need to have the Azure Storage Emulator installed. You can download the emulator from the [Azure Storage Emulator download page](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-emulator).

Once you have the tools installed, you can run the API locally using the following command:

```bash
func start
```

This will start the API on `http://localhost:7071`. You can then use a tool like Postman to interact
with the API.

## Deploying the API to Azure

To deploy the API to Azure, you will need an Azure subscription. You can create a free account at [https://azure.com](https://azure.com).

Once you have an Azure subscription, you can deploy the API to Azure using the following command:

```bash
func azure functionapp publish <functionAppName>
```

Replace `<functionAppName>` with the name of the Azure Function App you want to create.

This will deploy the API to Azure and provide you with a URL that you can use to interact with the API.

## API Documentation

The API documentation is available at [https://flashcard-management-api.azurewebsites.net/api-docs](https://flashcard-management-api.azurewebsites.net/api-docs).
