# Steps to setup the infrastructure

- Login azure cli

  ```bash
  az login
  ```

- Create a resource group

  ```bash
  az group create --name ProdFlashVocabRG --location "Southeast Asia"
  ```

- Create a storage account

  ```bash
  az storage account create --name prodflashvocabsa --resource-group ProdFlashVocabRG --location southeastasia  --sku Standard_LRS
  ```

- Create Modules table

  ```bash
  az storage table create --name Modules --account-name prodflashvocabsa
  ```

- Create Topics table

  ```bash
  az storage table create --name Topics --account-name prodflashvocabsa
  ```

- Create Flashcards table

  ```bash
  az storage table create --name Flashcards --account-name prodflashvocabsa
  ```

- Create Devices table

  ```bash
  az storage table create --name Devices --account-name prodflashvocabsa
  ```

- Create Modules blob container

  ```bash
  az storage container create --name modules --account-name prodflashvocabsa
  ```

- Create a function app

  ```bash
  az functionapp create --resource-group ProdFlashVocabRG --consumption-plan-location southeastasia --runtime node --runtime-version 18 --functions-version 4 --name ProdFlashcardMngtApiFnApp --storage-account prodflashvocabsa
  ```

- Deploy the function app

  ```bash
  func azure functionapp publish ProdFlashcardMngtApiFnApp
  ```

- Get the function app URL

  ```bash
  az functionapp show --name ProdFlashcardMngtApiFnApp --resource-group ProdFlashVocabRG --query "defaultHostName" --output tsv
  ```

- Get Storage Account Connection String

  ```bash
  az storage account show-connection-string --name prodflashvocabsa --resource-group ProdFlashVocabRG --query "connectionString" --output tsv
  ```

- Update the function app settings

  ```bash
  az functionapp config appsettings set --name ProdFlashcardMngtApiFnApp --resource-group ProdFlashVocabRG --settings AzureWebJobsStorage="< Storage Account Connection String >" AzureWebJobsSecretStorageType=Blob StorageConnectionString=" < Storage Account Connection String >" BLOB_CONTAINER_NAME="modules" TABLE_NAME="Modules" TOPICS_TABLE_NAME="Topics" FLASHCARDS_TABLE_NAME="Flashcards" DEVICES_TABLE_NAME="Devices"
  ```

- Update the function app CORS settings

  ```bash
  az functionapp cors add --name ProdFlashcardMngtApiFnApp --resource-group ProdFlashVocabRG --allowed-origins "http://localhost:4200"
  ```
