export const FHE_PURCHASE_MANAGER_ABI = [
  {
    "inputs": [
      { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "getEncryptedBalance",
    "outputs": [
      { "internalType": "bytes32", "name": "", "type": "bytes32" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPurchaseCount",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "getPurchase",
    "outputs": [
      { "internalType": "address", "name": "buyer", "type": "address" },
      { "internalType": "bytes32", "name": "remaining", "type": "bytes32" },
      { "internalType": "bytes32", "name": "recipient", "type": "bytes32" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "encAmount", "type": "bytes32" },
      { "internalType": "bytes", "name": "amountProof", "type": "bytes" },
      { "internalType": "bytes32", "name": "encRecipient", "type": "bytes32" },
      { "internalType": "bytes", "name": "recipientProof", "type": "bytes" }
    ],
    "name": "purchase",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

