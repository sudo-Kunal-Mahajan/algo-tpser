import algosdk from "algosdk";

// #########################################################
//Uncomment the following for Algonode API


// const algod_api_base  = "https://testnet-api.algonode.cloud"
// const indexer_base = "https://testnet-idx.algonode.cloud"
// const token = '';
// const port = '';
// export const which_api = "Algonode API (TestNet)"


// #########################################################
//Uncomment the following for PureStake API

const algod_api_base = 'https://testnet-algorand.api.purestake.io/ps2'
const indexer_base = 'https://testnet-algorand.api.purestake.io/idx2'
const port= '';
const token = {
    'X-API-Key': process.env.REACT_APP_PURE_STAKE_API_KEY
}
export const which_api = "PureStake API (TestNet)"

// #########################################################
//Uncomment the following for Local API
//export const algodClient = new algosdk.Algodv2(process.env.REACT_APP_LOCAL_ALGOD_TOKEN, 'http://127.0.0.1', 8080);

export const algodClient = new algosdk.Algodv2(token, algod_api_base, port);
export const algoIndexer= new algosdk.Indexer(token, indexer_base, port);
