# Flashcard Management API Project

This project is a RESTful API for managing flashcards. It is built using Azure Functions and Azure Table Storage. The API allows users to create, read, update, and delete modules, topics and flashcards. The API also allows users to retrieve flashcards by module and topic.

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

The API documentation is available at [API Docs](API_DOCS.md).
