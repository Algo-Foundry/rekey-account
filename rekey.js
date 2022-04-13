const algosdk = require("algosdk");
const {mnemonicToSecretKey} = require("algosdk");

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
  // Uncomment below if you want to generate account through code
  // Account A
  // let myAccountA = algosdk.generateAccount();
  // console.log("My account A address: %s", myAccountA.addr);
  //
  // // // Account B
  // let myAccountB = algosdk.generateAccount();
  // console.log("My account B address: %s", myAccountB.addr);
  //
  // // // Account C
  // let myAccountC = algosdk.generateAccount();
  // console.log("My account C address: %s", myAccountC.addr);

  // Write your code here
  let myAccountA = mnemonicToSecretKey(process.env.MNEMONIC_A);
  console.log("My account A address: %s", myAccountA.addr);

  // Account B
  let myAccountB = mnemonicToSecretKey(process.env.MNEMONIC_B);
  console.log("My account B address: %s", myAccountB.addr);

  // Account C
  let myAccountC = mnemonicToSecretKey(process.env.MNEMONIC_C);
  console.log("My account C address: %s", myAccountC.addr);

  // Create multisig address
  let multisigParams = {
    version: 1,
    threshold: 1,
    addrs: [
      myAccountB.addr,
      myAccountC.addr,
    ],
  };

  let multsigaddr = algosdk.multisigAddress(multisigParams);
  console.log("Multisig Address: " + multsigaddr);

  // Rekey account A to Multisig address
  let params = await algodClient.getTransactionParams().do();

  let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: myAccountA.addr,
    to: myAccountA.addr,
    amount: 0,
    suggestedParams: params,
    rekeyTo: multsigaddr,
  });

  let signedTxn = algosdk.signMultisigTransaction(txn, multisigParams, myAccountB.sk);
  let txId = txn.txID().toString();
  console.log("Signed transaction with txID: %s", txId);

  await submitToNetwork(signedTxn.blob);

  // Send Algo to Account B
  params = await algodClient.getTransactionParams().do();

  txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: myAccountA.addr,
    to: myAccountB.addr,
    amount: 100000,
    suggestedParams: params,
  });

  let multisigSignedTxn = algosdk.signMultisigTransaction(txn, multisigParams, myAccountC.sk);
  txId = txn.txID().toString();
  console.log("Signed transaction with txID: %s", txId);

  await submitToNetwork(multisigSignedTxn.blob);
})();
