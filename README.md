This is a basic Algorand App providing a GUI to send batch transactions at user defined speed to their desired wallet. Uses AlgoNode API to push the transactions (user can pair up their own nodes as well).

## How to?


- On the GUI, user can either Import their account with seed phrase or generate a new address.

- After importing the account, user can send batch transactions to their desired wallet. Max transactions in a batch is customizable. Default is set to 10.

- Amount per transaction can also be customized and is 0 microAlgo by default.

## Pair up your own node or configure API endpoint

- Clone the repo.

- Run `npm install` to install all the dependencies.

- Configure your API source for getting data.
    - Create a ".env" file in source folder and provide it with the PureStake API key. (REACT_APP_PURE_STAKE_API_KEY="XXXXXXXX")
    - Or, you can use AlgoNodes API. To do so, go to "src/utils/AlgorandUtils.js". There, uncomment the  AlgoNode API config and comment the PureStake API.
    - Or, you can just provide your own Algod token for local node ( usually 'a' * 64 ).

- Run `npm start` to start the project.
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.



Let me know if you have any queries or suggestions. Send out a pull request if you want to contribute. 
Starring the repo would be appreciated. 

## FYI
You can dust in my account as well ;-)

``` 
  Algorand: NA4VOZFZFSGZM6AQMMUMEIDSPQXN4GLEDE7OD4SFVNHV7APXIIWNL62AT4
```
