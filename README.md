## Rekey account assignment

You are given 3 accounts - A, B and C. Rekey account A to a MultiSig account. The MultiSig account should contain B and C and have a threshold of 1. Once account A is rekeyed, use it to send 100,000 microAlgos (or 0.1 Algos) to account B.

Write your solution in the skeleton code provided in `rekey.js`

### Key points to remember
1. Accounts need to maintain a minimum balance of 100,000 microAlgos to carry out transactions.
2. Transactions sent from a rekeyed account needs to be signed off by the authorising account.
3. A MultiSig account with a threshold of 1 means that either B or C can sign off.

### Hints
These are the javascript SDK functions needed to carry out transactions. Refer to the [documentation](https://algorand.github.io/js-algorand-sdk/index.html) for more details. 
```
// get suggested params for transactions
let params = await algodClient.getTransactionParams().do();

// create a payment transaction
let txn = algosdk.makePaymentTxnWithSuggestedParams(...);

// sign a transaction
let signedTxn = txn.signTxn(...);

// create a multisig account
let multsigaddr = algosdk.multisigAddress(...);

// sign a multisig transaction
let signedTxn = algosdk.signMultisigTransaction(...).blob;

// check account information
let account = algodClient.accountInformation(...).do()
```

### Rekey Transaction
1. For a rekey transaction, create a payment transaction with the following, 
    - Set the amount 0. 
    - Receiver has the same address as the sender.
    - Specify the account to rekey to.