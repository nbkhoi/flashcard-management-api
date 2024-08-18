# Steps to setup the infrastructure

- Login azure cli

  ```bash
  az login
  ```

- Create a resource group

  ```bash
  az group create --name ProdFlashcardMngtApiRG --location "Southeast Asia"
  ```

- Create a storage account

  ```bash
  az storage account create --name prodflashcardmngapitsa --resource-group ProdFlashcardMngtApiRG --location southeastasia  --sku Standard_LRS
  ```

- Create Modules table

  ```bash
  az storage table create --name Modules --account-name prodflashcardmngapitsa
  ```

- Create Topics table

  ```bash
  az storage table create --name Topics --account-name prodflashcardmngapitsa
  ```

- Create Flashcards table

  ```bash
  az storage table create --name Flashcards --account-name prodflashcardmngapitsa
  ```

- Create Devices table

  ```bash
  az storage table create --name Devices --account-name prodflashcardmngapitsa
  ```

- Create a function app

  ```bash
  az functionapp create --resource-group ProdFlashcardMngtApiRG --consumption-plan-location southeastasia --runtime node --runtime-version 18 --functions-version 4 --name ProdFlashcardMngtApiFnApp --storage-account prodflashcardmngapitsa
  ```

- Deploy the function app

  ```bash
  func azure functionapp publish ProdFlashcardMngtApiFnApp
  ```

- Get the function app URL

  ```bash
  az functionapp show --name ProdFlashcardMngtApiFnApp --resource-group ProdFlashcardMngtApiRG --query "defaultHostName" --output tsv
  ```

- Update the function app settings

  ```bash
  az functionapp config appsettings set --name ProdFlashcardMngtApiFnApp --resource-group ProdFlashcardMngtApiRG --settings AzureWebJobsStorage="DefaultEndpointsProtocol=https;AccountName=devflashcardmngtsa;AccountKey=<account-key>;TableEndpoint=https://devflashcardmngtsa.table.core.windows.net/;QueueEndpoint=https://devflashcardmngtsa.queue.core.windows.net/;FileEndpoint=https://devflashcardmngtsa.file.core.windows.net/;BlobEndpoint=https://devflashcardmngtsa.blob.core.windows.net/" AzureWebJobsSecretStorageType=Blob
  ```

- Update the function app CORS settings

  ```bash
  az functionapp cors add --name ProdFlashcardMngtApiFnApp --resource-group ProdFlashcardMngtApiRG --allowed-origins "*"
  ```

- Update the function app runtime settings

  ```bash
  az functionapp config appsettings set --name ProdFlashcardMngtApiFnApp --resource-group ProdFlashcardMngtApiRG --settings FUNCTIONS_WORKER_RUNTIME=node
  ```

- Update the function app runtime version

  ```bash
  az functionapp config appsettings set --name ProdFlashcardMngtApiFnApp --resource-group ProdFlashcardMngtApiRG --settings FUNCTIONS_EXTENSION_VERSION=~4
  ```

- Update the function app node version

  ```bash
  az functionapp config appsettings set --name ProdFlashcardMngtApiFnApp --resource-group ProdFlashcardMngtApiRG --settings WEBSITE_NODE_DEFAULT_VERSION=18
  ```
