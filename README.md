# CSCI 5409 Project - Adv. Cloud Computing

## Dependencies
- npm install --save-dev nodemon 
- npm install --save axios ejs express mysql2

## Required Environment Variables
<----------E-SHOP DB ENVS------------>
- ESHOP_DB_HOST=e-shop-cloud.cmurfyujqei1.us-east-1.rds.amazonaws.com
- ESHOP_DB_USER=admin
- ESHOP_DB_PASSWORD=Test1234
- ESHOP_DB_SCHEMA=eshop

<----------EWALLET ENVS------------>
- EWALLET_URL_ORDER=https://ewalletcloud.azurewebsites.net/wallet/debit
- EWALLET_URL_PREPARE=https://ewalletcloud.azurewebsites.net/wallet/2pc/prepare
- EWALLET_URL_COMMIT=https://ewalletcloud.azurewebsites.net/wallet/2pc/commit
- EWALLET_URL_ROLLBACK=https://ewalletcloud.azurewebsites.net/wallet/2pc/rollback
- EWALLET_URL_AUTHENTICATE=https://ewalletcloud.azurewebsites.net/wallet/authenticate

 <----------WAREHOUSE ENVS------------>
- WAREHOUSE_URL_FETCHALL=https://1q43gpkgr8.execute-api.us-east-1.amazonaws.com/prod/products/getAll
- WAREHOUSE_URL_ORDER=https://1q43gpkgr8.execute-api.us-east-1.amazonaws.com/prod/xa/2pc/order
- WAREHOUSE_URL_PREPARE=https://1q43gpkgr8.execute-api.us-east-1.amazonaws.com/prod/xa/2pc/prepare
- WAREHOUSE_URL_COMMIT=https://1q43gpkgr8.execute-api.us-east-1.amazonaws.com/prod/xa/2pc/commit
- WAREHOUSE_URL_ROLLBACK=https://1q43gpkgr8.execute-api.us-east-1.amazonaws.com/prod/xa/2pc/rollback