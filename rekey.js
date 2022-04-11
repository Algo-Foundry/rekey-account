const algosdk = require("algosdk");

const algodClient = new algosdk.Algodv2(
  process.env.ALGOD_TOKEN,
  process.env.ALGOD_SERVER,
  process.env.ALGOD_PORT
);

const creator = algosdk.mnemonicToSecretKey(process.env.MNEMONIC_CREATOR);

const submitToNetwork = async (signedTxn) => {
  // send txn
  let tx = await algodClient.sendRawTransaction(signedTxn).do();
  console.log("Transaction : " + tx.txId);

  // Wait for transaction to be confirmed
  confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);

  //Get the completed Transaction
  console.log(
    "Transaction " +
      tx.txId +
      " confirmed in round " +
      confirmedTxn["confirmed-round"]
  );

  return confirmedTxn;
};

(async () => {
  // Account A
  let myAccountA = algosdk.generateAccount();
  console.log("My account A address: %s", myAccountA.addr);

  // Account B
  let myAccountB = algosdk.generateAccount();
  console.log("My account B address: %s", myAccountB.addr);

  // Account C
  let myAccountC = algosdk.generateAccount();
  console.log("My account C address: %s", myAccountC.addr);
  
  // Write your code here
})();
