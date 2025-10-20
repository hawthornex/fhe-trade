# FHE Trade

A privacy-preserving decentralized trading platform built on Fully Homomorphic Encryption (FHE), enabling confidential purchases where both transaction amounts and recipient addresses remain encrypted on-chain.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Problem Statement](#problem-statement)
- [Solution & Advantages](#solution--advantages)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Smart Contracts](#smart-contracts)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security Model](#security-model)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Overview

FHE Trade is a groundbreaking decentralized application that leverages Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine) to enable completely private on-chain transactions. Unlike traditional blockchain transactions where all data is publicly visible, FHE Trade allows users to create encrypted purchase orders where the purchase amount and recipient address remain confidential while still being verifiable through cryptographic proofs.

This project demonstrates the power of homomorphic encryption in blockchain applications, opening new possibilities for privacy-preserving decentralized finance (DeFi), confidential marketplaces, and private payment systems.

## Key Features

### Privacy-Preserving Transactions
- **Encrypted Amounts**: Purchase amounts are encrypted using FHE before being submitted on-chain
- **Hidden Recipients**: Recipient addresses are encrypted, preventing transaction graph analysis
- **Private Balance Tracking**: User balances are stored in encrypted form
- **Selective Decryption**: Users can decrypt their own balance with cryptographic signatures

### Smart Contract Capabilities
- **Confidential Purchase Creation**: Buyers can create purchase orders with encrypted parameters
- **Claim Verification**: Recipients can claim purchases through zero-knowledge-like verification
- **Multi-Claim Support**: Users can claim multiple purchases in a single transaction
- **Duplicate Prevention**: Built-in mechanism prevents double-claiming of purchases

### User Experience
- **Modern Web Interface**: React-based frontend with responsive design
- **Multi-Wallet Support**: Integration with MetaMask, WalletConnect, Coinbase Wallet, and more
- **Real-Time Updates**: React Query integration for efficient data fetching
- **Seamless Encryption**: Client-side encryption using Zama's relayer SDK

## Problem Statement

### Current Blockchain Limitations

1. **Lack of Privacy**: Traditional blockchains expose all transaction details publicly, including:
   - Sender and receiver addresses
   - Transaction amounts
   - Transaction patterns and relationships

2. **Regulatory Concerns**: Financial privacy is often necessary for:
   - Business transactions that require confidentiality
   - Individual privacy protection
   - Compliance with data protection regulations

3. **Competitive Intelligence**: Public transaction data allows:
   - Competitors to analyze business activities
   - Front-running of large transactions
   - Market manipulation based on visible order books

4. **User Safety**: Public transaction history can:
   - Expose user wealth and spending patterns
   - Create security risks for high-value holders
   - Enable targeted attacks or social engineering

### Existing Solutions and Their Shortcomings

- **Mixers/Tumblers**: Often associated with illicit activities and targeted by regulators
- **Privacy Coins**: Face regulatory challenges and limited DeFi integration
- **Zero-Knowledge Proofs**: Complex to implement and often limited in scope
- **Layer 2 Privacy Solutions**: Require additional trust assumptions and infrastructure

## Solution & Advantages

### Our Approach

FHE Trade uses **Fully Homomorphic Encryption (FHE)** to perform computations directly on encrypted data without ever decrypting it. This revolutionary approach provides:

### Advantages Over Traditional Solutions

#### 1. Native On-Chain Privacy
- **No Off-Chain Dependencies**: All privacy is guaranteed at the smart contract level
- **Verifiable Computation**: Encrypted operations are deterministic and auditable
- **No Trusted Setup**: Unlike ZK-SNARKs, FHE requires no trusted ceremony

#### 2. Regulatory Compliance
- **Selective Disclosure**: Users can decrypt and prove their transactions when needed
- **Audit Support**: Authorized parties can be granted decryption keys
- **Transparent Privacy**: Privacy mechanism is open-source and auditable

#### 3. Developer-Friendly
- **Familiar Solidity**: Write smart contracts using familiar syntax with FHE types
- **Easy Integration**: Simple client-side SDK for encryption/decryption
- **Comprehensive Tooling**: Hardhat integration with testing and deployment tools

#### 4. Scalability Potential
- **Composable Privacy**: Encrypted values can be used across different contracts
- **Efficient Operations**: Optimized FHE operations for common use cases
- **Future-Proof**: Designed to leverage ongoing FHE performance improvements

#### 5. True Confidentiality
- **End-to-End Encryption**: Data encrypted before leaving user's device
- **On-Chain Privacy**: Encrypted data never exposed on the blockchain
- **Selective Decryption**: Only authorized parties can decrypt specific values

## Technology Stack

### Smart Contract Layer
- **Solidity ^0.8.24** - Primary smart contract language
- **FHEVM Protocol** - Fully Homomorphic Encryption virtual machine by Zama
- **Hardhat ^2.26.0** - Development framework with extensive plugin ecosystem
- **TypeChain ^8.3.2** - Type-safe contract bindings for TypeScript

### Frontend Application
- **React 19.1.1** - Modern UI library with latest features
- **Vite ^7.1.6** - Lightning-fast build tool and dev server
- **TypeScript ^5.8.3** - Type-safe JavaScript with advanced type features
- **Wagmi ^2.17.0** - React hooks library for Ethereum
- **Viem ^2.37.6** - Lightweight alternative to ethers.js for reads
- **Ethers.js ^6.15.0** - Web3 library for contract writes
- **RainbowKit ^2.2.8** - Beautiful wallet connection UI
- **TanStack Query ^5.89.0** - Powerful async state management

### Encryption & Privacy
- **@zama-fhe/relayer-sdk ^0.2.0** - Client-side encryption/decryption SDK
- **@fhevm/solidity ^0.8.0** - FHE-enabled Solidity library
- **@fhevm/hardhat-plugin ^0.1.0** - Hardhat integration for FHE compilation
- **encrypted-types ^0.0.4** - TypeScript types for encrypted values

### Development Tools
- **ESLint & Prettier** - Code quality and formatting
- **Solhint ^6.0.0** - Solidity code linter
- **Mocha ^11.7.1** - Test framework
- **Chai ^4.5.0** - Assertion library
- **Hardhat Deploy ^0.11.45** - Declarative deployment system
- **Solidity Coverage ^0.8.16** - Test coverage reporting
- **Gas Reporter ^2.3.0** - Gas usage analysis

### Network Infrastructure
- **Sepolia Testnet** - Primary deployment network
- **Infura** - Reliable RPC provider
- **Hardhat Network** - Local development blockchain

## Architecture

### System Overview

```
┌─────────────┐         ┌──────────────┐         ┌──────────────────┐
│   Browser   │         │  Zama Relay  │         │   Blockchain     │
│             │         │              │         │                  │
│  React App  │────────▶│  Encryption  │────────▶│  FHE Contracts   │
│  (Vite)     │◀────────│  Service     │◀────────│  (Sepolia)       │
│             │         │              │         │                  │
└─────────────┘         └──────────────┘         └──────────────────┘
      │                                                    │
      │                                                    │
      ▼                                                    ▼
┌─────────────┐                                  ┌──────────────────┐
│  Wallet     │                                  │   FHEVM          │
│  (MetaMask) │                                  │   Coprocessor    │
│  Signing    │                                  │   (Encrypted     │
│             │                                  │    Computation)  │
└─────────────┘                                  └──────────────────┘
```

### Data Flow

#### Purchase Creation Flow

1. **User Input** (Frontend)
   - User enters amount (e.g., 100 tokens)
   - User enters recipient address (e.g., 0x742d...)

2. **Client-Side Encryption** (Zama SDK)
   - Amount encrypted to `euint32` ciphertext
   - Recipient encrypted to `euint256` ciphertext
   - Generate cryptographic proofs for validity

3. **Transaction Submission** (Web3)
   - Encrypted data + proofs sent to smart contract
   - User signs transaction with wallet
   - Transaction mined on Sepolia

4. **On-Chain Storage** (Smart Contract)
   - Purchase stored with encrypted amount and recipient
   - Purchase ID assigned
   - Event emitted (with encrypted data)

#### Claim Flow

1. **User Initiates Claim** (Frontend)
   - User specifies purchase IDs to claim
   - Transaction sent to smart contract

2. **FHE Verification** (Smart Contract)
   - For each purchase ID:
     - Compare encrypted recipient with encrypted caller address
     - Use FHE.eq() to check equality under encryption
     - Use FHE.select() to conditionally add amount to balance
   - Update user's encrypted balance
   - Mark purchases as claimed

3. **Balance Update** (Smart Contract)
   - Encrypted balances updated atomically
   - No decryption occurs on-chain
   - State changes recorded in encrypted form

#### Balance Decryption Flow

1. **Request Decryption Permission** (Frontend)
   - User signs EIP-712 message granting 10-day decryption access
   - Permission sent to relayer

2. **Fetch Encrypted Balance** (Smart Contract)
   - Read user's encrypted balance handle
   - Return encrypted value to frontend

3. **Decrypt Balance** (Relayer SDK)
   - SDK sends decryption request to relayer
   - Relayer verifies signature and permission
   - Plaintext balance returned to user

### Smart Contract Architecture

```
FHEPurchaseManager
├── State Variables
│   ├── purchases: mapping(uint256 => Purchase)
│   ├── balances: mapping(address => euint32)
│   └── purchaseCount: uint256
│
├── External Functions
│   ├── purchase(amount, recipient)
│   ├── claim(purchaseIds[])
│   └── getEncryptedBalance(user)
│
└── Internal Functions
    ├── _claimSingle(purchaseId)
    └── _updateBalance(user, amount)
```

### Frontend Architecture

```
App (Wagmi Provider)
└── HomeApp
    ├── Header Component
    │   └── Wallet Connection (RainbowKit)
    │
    ├── Create Purchase Section
    │   ├── Amount Input
    │   ├── Recipient Input
    │   └── Encrypt & Submit
    │
    └── Balance Section
        ├── Display Encrypted Handle
        └── Decrypt Button (EIP-712)
```

## Smart Contracts

### FHEPurchaseManager

**Location**: `contracts/FHEPurchaseManager.sol`

The core contract enabling confidential purchases.

#### Key Functions

```solidity
function purchase(
    externalEuint32 encAmount,
    bytes calldata amountProof,
    externalEuint256 encRecipient,
    bytes calldata recipientProof
) external returns (uint256 id)
```
Creates an encrypted purchase order. The amount and recipient are provided as encrypted inputs with validity proofs.

**Parameters**:
- `encAmount`: Encrypted amount (32-bit unsigned integer)
- `amountProof`: Cryptographic proof that the encrypted amount is valid
- `encRecipient`: Encrypted recipient address (256-bit value)
- `recipientProof`: Cryptographic proof that the encrypted recipient is valid

**Returns**: Unique purchase ID

**Emits**: `PurchaseCreated(id, buyer, encryptedAmount, encryptedRecipient)`

---

```solidity
function claim(uint256[] calldata ids) external
```
Allows users to claim purchases intended for them. Uses FHE computation to verify the caller is the intended recipient without revealing the recipient address.

**Parameters**:
- `ids`: Array of purchase IDs to claim

**Logic**:
- For each ID, performs encrypted equality check: `FHE.eq(purchase.recipient, callerAddress)`
- If match, adds encrypted amount to caller's balance
- Marks purchase as claimed (sets remaining to 0)

**Security**:
- Each purchase can only be claimed once
- Only the correct recipient will successfully increase their balance
- Wrong recipients can attempt to claim but receive nothing

---

```solidity
function getEncryptedBalance(address user) external view returns (euint32)
```
Returns the encrypted balance for a given user.

**Parameters**:
- `user`: Address to query balance for

**Returns**: Encrypted balance handle (euint32)

**Note**: Cannot use `msg.sender` as this is a view function that may be called by relayers

---

```solidity
function getPurchaseCount() external view returns (uint256)
```
Returns the total number of purchases created.

---

```solidity
function getPurchase(uint256 id) external view returns (
    address buyer,
    euint32 remaining,
    euint256 recipient
)
```
Returns the details of a specific purchase (all encrypted except buyer address).

#### Data Structures

```solidity
struct Purchase {
    address buyer;          // Public: who created the purchase
    euint32 remaining;      // Encrypted: remaining claimable amount
    euint256 recipient;     // Encrypted: intended recipient address
}
```

#### Events

```solidity
event PurchaseCreated(
    uint256 indexed id,
    address indexed buyer,
    euint32 encryptedAmount,
    euint256 encryptedRecipient
)

event PurchaseClaimed(
    uint256 indexed id,
    address indexed claimer
)
```

### FHECounter

**Location**: `contracts/FHECounter.sol`

Example contract demonstrating basic FHE operations.

#### Key Functions

```solidity
function increment(externalEuint32 value, bytes calldata proof) external
function decrement(externalEuint32 value, bytes calldata proof) external
function getCount() external view returns (euint32)
```

**Purpose**: Educational reference for FHE contract development

## Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Version 9 or higher (or yarn/pnpm)
- **Git**: For cloning the repository
- **Metamask**: Browser wallet extension (or any Web3 wallet)
- **Sepolia ETH**: Test ETH for gas fees ([Sepolia Faucet](https://sepoliafaucet.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/fhe-trade.git
   cd fhe-trade
   ```

2. **Install dependencies**

   ```bash
   npm install
   cd app
   npm install
   cd ..
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   PRIVATE_KEY=your_private_key_here
   INFURA_API_KEY=your_infura_api_key_here
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

   **Security Warning**: Never commit your `.env` file. It's already in `.gitignore`.

4. **Compile contracts**

   ```bash
   npm run compile
   ```

5. **Run tests**

   ```bash
   npm test
   ```

### Quick Start - Frontend

1. **Start the development server**

   ```bash
   cd app
   npm run dev
   ```

2. **Open your browser**

   Navigate to `http://localhost:5173`

3. **Connect your wallet**

   Click "Connect Wallet" and select your preferred wallet

4. **Ensure you're on Sepolia**

   Switch your wallet network to Sepolia testnet

5. **Create a purchase**

   - Enter an amount (e.g., 100)
   - Enter a recipient address (0x format)
   - Click "Create Purchase"
   - Confirm the transaction in your wallet

### Quick Start - Smart Contracts

1. **Deploy to Sepolia**

   ```bash
   npx hardhat deploy --network sepolia
   ```

2. **Verify on Etherscan**

   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

3. **Interact via Hardhat tasks**

   ```bash
   # Create a purchase
   npx hardhat purchase:buy --value 100 \
     --recipient 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1 \
     --network sepolia

   # Claim purchases
   npx hardhat purchase:claim --ids 0,1,2 --network sepolia

   # Check balance
   npx hardhat purchase:decrypt-balance \
     --user 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1 \
     --network sepolia
   ```

## Project Structure

```
fhe-trade/
├── app/                          # Frontend React application
│   ├── src/
│   │   ├── abi/                 # Contract ABI definitions
│   │   │   └── FHEPurchaseManager.ts
│   │   ├── components/          # React components
│   │   │   └── Header.tsx
│   │   ├── config/              # Configuration files
│   │   │   └── wagmi.ts         # Wagmi/RainbowKit config
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useZamaInstance.ts
│   │   │   └── useEthersSigner.ts
│   │   ├── home/                # Main app component
│   │   │   └── HomeApp.tsx
│   │   ├── App.tsx              # Root component
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── public/                  # Static assets
│   ├── index.html               # HTML template
│   ├── vite.config.ts           # Vite configuration
│   └── package.json             # Frontend dependencies
│
├── contracts/                    # Solidity smart contracts
│   ├── FHEPurchaseManager.sol   # Main purchase manager contract
│   └── FHECounter.sol           # Example counter contract
│
├── deploy/                       # Hardhat deployment scripts
│   └── deploy_purchase.ts       # FHEPurchaseManager deployment
│
├── tasks/                        # Hardhat custom tasks
│   ├── accounts.ts              # Account management
│   ├── FHECounter.ts            # Counter interactions
│   └── FHEPurchaseManager.ts    # Purchase manager interactions
│
├── test/                         # Test suite
│   ├── FHECounter.ts            # Counter contract tests
│   ├── FHECounterSepolia.ts     # Sepolia-specific tests
│   └── FHEPurchaseManager.ts    # Purchase manager tests
│
├── types/                        # TypeChain generated types
│   ├── @fhevm/                  # FHEVM type definitions
│   ├── contracts/               # Contract types
│   └── factories/               # Contract factory types
│
├── docs/                         # Documentation
│   ├── zama_llm.md              # Zama contract documentation
│   └── zama_doc_relayer.md      # Relayer SDK documentation
│
├── artifacts/                    # Compiled contract artifacts
├── cache/                        # Hardhat cache
├── deployments/                  # Deployment artifacts by network
│
├── hardhat.config.ts            # Hardhat configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Root dependencies
├── .env                         # Environment variables (not committed)
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## Usage

### Frontend Usage

#### Creating a Purchase

1. Navigate to the "Create Purchase" section
2. Enter the amount you want to send (integer, e.g., 100)
3. Enter the recipient's Ethereum address (0x format)
4. Click "Create Purchase"
5. The frontend will:
   - Initialize Zama encryption SDK
   - Encrypt both amount and recipient address
   - Generate cryptographic proofs
   - Submit the transaction to the smart contract
6. Confirm the transaction in your wallet
7. Wait for transaction confirmation
8. The purchase ID will be displayed

#### Viewing Your Balance

1. Navigate to the "My Balance" section
2. Your encrypted balance handle is displayed
3. Click "Decrypt Balance" to see the actual value
4. Sign the EIP-712 message to grant 10-day decryption permission
5. Your plaintext balance will be displayed

#### Claiming Purchases

Currently implemented via Hardhat tasks (UI coming in future updates):

```bash
npx hardhat purchase:claim --ids 0,1,2 --network sepolia
```

### Smart Contract Usage

#### Hardhat Tasks

**FHEPurchaseManager Tasks**:

```bash
# Get contract address
npx hardhat purchase:address --network sepolia

# Create a purchase (CLI)
npx hardhat purchase:buy \
  --value 100 \
  --recipient 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1 \
  --network sepolia

# Claim multiple purchases
npx hardhat purchase:claim \
  --ids 0,1,2 \
  --network sepolia

# Decrypt a user's balance
npx hardhat purchase:decrypt-balance \
  --user 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1 \
  --network sepolia

# Get total purchase count
npx hardhat purchase:count --network sepolia
```

**FHECounter Tasks**:

```bash
# Get current counter address
npx hardhat task:address --network sepolia

# Increment counter
npx hardhat task:increment --value 5 --network sepolia

# Decrement counter
npx hardhat task:decrement --value 3 --network sepolia

# Decrypt and view counter value
npx hardhat task:decrypt-count --network sepolia
```

#### Programmatic Usage (TypeScript)

```typescript
import { ethers } from 'ethers';
import { FHEPurchaseManager__factory } from './types';
import { ZamaRelayerSDK } from '@zama-fhe/relayer-sdk';

// Initialize provider and signer
const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_KEY');
const signer = new ethers.Wallet('PRIVATE_KEY', provider);

// Connect to contract
const contractAddress = '0x...';
const contract = FHEPurchaseManager__factory.connect(contractAddress, signer);

// Initialize Zama SDK
const zamaSDK = await ZamaRelayerSDK.init({ network: 'sepolia' });

// Create encrypted inputs
const amount = 100;
const recipient = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1';

const encryptedAmount = await zamaSDK.encrypt32(amount);
const encryptedRecipient = await zamaSDK.encrypt256(BigInt(recipient));

// Create purchase
const tx = await contract.purchase(
  encryptedAmount.handle,
  encryptedAmount.proof,
  encryptedRecipient.handle,
  encryptedRecipient.proof
);

const receipt = await tx.wait();
console.log(`Purchase created with ID: ${receipt.logs[0].args.id}`);

// Claim purchases
const claimTx = await contract.claim([0, 1, 2]);
await claimTx.wait();
console.log('Purchases claimed successfully');

// Get encrypted balance
const encBalance = await contract.getEncryptedBalance(signer.address);

// Decrypt balance
const decryptedBalance = await zamaSDK.decrypt(encBalance);
console.log(`Balance: ${decryptedBalance}`);
```

## Development

### Available Scripts

**Root Project**:

```bash
npm run compile       # Compile all contracts
npm run test          # Run all tests
npm run coverage      # Generate test coverage report
npm run lint          # Run ESLint on contracts and scripts
npm run lint:fix      # Auto-fix linting issues
npm run clean         # Clean artifacts and cache
npm run deploy:sepolia # Deploy to Sepolia testnet
npm run chain         # Start local Hardhat node
```

**Frontend (app/)**:

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint on frontend code
```

### Adding New Contracts

1. Create your contract in `contracts/`:

   ```solidity
   // contracts/MyNewContract.sol
   pragma solidity ^0.8.24;

   import "@fhevm/solidity/contracts/TFHE.sol";

   contract MyNewContract {
       euint32 private myEncryptedValue;

       function setEncryptedValue(externalEuint32 value, bytes calldata proof) public {
           euint32 validated = FHE.asEuint32(value, proof);
           myEncryptedValue = validated;
       }
   }
   ```

2. Create deployment script in `deploy/`:

   ```typescript
   // deploy/deploy_mynewcontract.ts
   import { HardhatRuntimeEnvironment } from 'hardhat/types';
   import { DeployFunction } from 'hardhat-deploy/types';

   const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
     const { deployer } = await hre.getNamedAccounts();
     const { deploy } = hre.deployments;

     await deploy('MyNewContract', {
       from: deployer,
       args: [],
       log: true,
     });
   };

   export default func;
   func.tags = ['MyNewContract'];
   ```

3. Compile and test:

   ```bash
   npm run compile
   npm test
   ```

### Working with FHE Types

**Supported Encrypted Types**:

- `euint8`, `euint16`, `euint32`, `euint64`, `euint128`, `euint256`: Encrypted unsigned integers
- `ebool`: Encrypted boolean
- `eaddress`: Encrypted address

**Common FHE Operations**:

```solidity
// Arithmetic
euint32 sum = FHE.add(a, b);
euint32 diff = FHE.sub(a, b);
euint32 prod = FHE.mul(a, b);

// Comparison (returns ebool)
ebool isEqual = FHE.eq(a, b);
ebool isGreater = FHE.gt(a, b);
ebool isLess = FHE.lt(a, b);

// Logical
ebool andResult = FHE.and(condition1, condition2);
ebool orResult = FHE.or(condition1, condition2);
ebool notResult = FHE.not(condition);

// Conditional selection
euint32 result = FHE.select(condition, valueIfTrue, valueIfFalse);

// Type conversion
euint32 validated = FHE.asEuint32(externalValue, proof);
```

### Testing Best Practices

1. **Use Mock Environment for FHE**: Tests run on FHEVM mock for speed

   ```typescript
   if (network.name === 'hardhat') {
     // FHE operations work in mock mode
   } else {
     // Skip FHE-heavy tests on real networks
     this.skip();
   }
   ```

2. **Test Both Encrypted and Decrypted Values**:

   ```typescript
   const encryptedBalance = await contract.getEncryptedBalance(user);
   const decrypted = await fhevm.decrypt32(encryptedBalance);
   expect(decrypted).to.equal(expectedValue);
   ```

3. **Test Access Control**:

   ```typescript
   // Test that only correct recipient can claim
   await expect(
     contract.connect(wrongUser).claim([purchaseId])
   ).to.not.changeTokenBalance(token, wrongUser);
   ```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/FHEPurchaseManager.ts

# Run tests with gas reporting
REPORT_GAS=true npm test

# Run tests with coverage
npm run coverage

# Run tests on Sepolia (limited, uses real FHE)
npx hardhat test --network sepolia
```

### Test Structure

**FHEPurchaseManager Tests** (`test/FHEPurchaseManager.ts`):

- Deployment validation
- Purchase creation with encrypted inputs
- Claim verification (correct recipient succeeds, wrong recipient fails)
- Balance updates after claims
- Duplicate claim prevention
- Multi-claim functionality

**FHECounter Tests** (`test/FHECounter.ts`):

- Counter initialization
- Encrypted increment operations
- Encrypted decrement operations
- Value persistence

### Coverage Report

Generate a detailed coverage report:

```bash
npm run coverage
```

Coverage report will be available in `coverage/index.html`.

**Current Coverage** (approximate):

- FHEPurchaseManager: ~95%
- FHECounter: 100%

## Deployment

### Deploying to Sepolia

1. **Ensure you have Sepolia ETH**

   Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

2. **Configure your environment**

   ```bash
   # .env file
   PRIVATE_KEY=your_private_key_without_0x_prefix
   INFURA_API_KEY=your_infura_project_id
   ```

3. **Deploy contracts**

   ```bash
   npx hardhat deploy --network sepolia
   ```

   Output will show deployed contract addresses:
   ```
   Deploying FHEPurchaseManager...
   FHEPurchaseManager deployed to: 0x1234567890123456789012345678901234567890
   ```

4. **Verify on Etherscan**

   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

5. **Update frontend configuration**

   Edit `app/src/abi/FHEPurchaseManager.ts` with the new contract address.

### Deploying to Local Network

1. **Start local Hardhat node**

   ```bash
   npx hardhat node
   ```

2. **Deploy in another terminal**

   ```bash
   npx hardhat deploy --network localhost
   ```

### Deployment Artifacts

Deployment information is saved in `deployments/<network>/`:

```
deployments/
├── sepolia/
│   ├── FHEPurchaseManager.json    # Contract ABI and address
│   ├── FHECounter.json
│   └── .chainId                    # Network chain ID
└── localhost/
    └── ...
```

### Mainnet Deployment Checklist

Before deploying to mainnet:

- [ ] All tests passing with 100% coverage
- [ ] Security audit completed
- [ ] Gas optimization review
- [ ] Access control verification
- [ ] Emergency pause mechanism tested
- [ ] Upgrade strategy documented
- [ ] Multi-sig setup for admin functions
- [ ] Frontend thoroughly tested on testnet
- [ ] Documentation complete and reviewed
- [ ] Community testing period completed

**Note**: FHE on mainnet requires Zama's mainnet support. Currently available on testnets only.

## Security Model

### Threat Model

**What is Protected**:
- Transaction amounts (encrypted on-chain)
- Recipient addresses (encrypted on-chain)
- User balances (encrypted on-chain)
- Transaction patterns (hidden via encryption)

**What is Public**:
- Buyer addresses (transaction sender)
- Purchase IDs and timestamps
- Number of purchases and claims
- Gas costs and transaction fees

### Cryptographic Guarantees

1. **Semantic Security**: Encrypted values reveal no information about plaintext
2. **Computational Privacy**: Computing on encrypted data doesn't leak information
3. **Proof-Based Validation**: All encrypted inputs include validity proofs
4. **Deterministic Encryption**: Same plaintext always produces same ciphertext (allows equality checks)

### Access Control

**Smart Contract Level**:
- Purchase creation: Open to anyone
- Claiming: Open to anyone, but only correct recipient benefits
- Balance viewing: Public (encrypted form)
- Decryption: Requires user signature and permission window

**Frontend Level**:
- Wallet connection required for all transactions
- EIP-712 signature required for decryption
- 10-day permission window for balance decryption

### Known Limitations

1. **Transaction Graph Analysis**: While amounts and recipients are hidden, the fact that a purchase occurred is public
2. **Timing Analysis**: Transaction timing is visible and could reveal patterns
3. **Gas Cost Correlation**: Gas costs might leak information about operation complexity
4. **Decryption Permission**: Users must explicitly grant decryption access (10-day window)
5. **Relayer Trust**: Decryption requires interaction with Zama relayer service

### Best Practices for Users

- Use fresh addresses for sensitive transactions
- Randomize transaction timing to avoid patterns
- Use multiple purchases for large amounts to reduce correlation
- Rotate recipient addresses periodically
- Be cautious when granting decryption permissions
- Verify contract addresses before interacting

### Audit Status

- **Internal Review**: Completed
- **Third-Party Audit**: Pending
- **Bug Bounty**: Not yet launched

**Report Security Issues**: security@yourproject.com (create this email)

## Roadmap

### Phase 1: MVP (Current)
- [x] Core FHEPurchaseManager contract
- [x] Basic frontend with purchase creation
- [x] Wallet integration (RainbowKit)
- [x] Client-side encryption (Zama SDK)
- [x] Balance viewing and decryption
- [x] Hardhat task suite
- [x] Comprehensive testing suite
- [x] Sepolia deployment

### Phase 2: Enhanced Functionality (Q2 2025)
- [ ] Claim functionality in frontend UI
- [ ] Purchase history viewer
- [ ] Multi-token support (ERC-20 integration)
- [ ] Batch operations optimization
- [ ] Advanced filtering and search
- [ ] Transaction notifications
- [ ] Mobile-responsive design improvements
- [ ] Dark mode support

### Phase 3: Advanced Features (Q3 2025)
- [ ] Time-locked purchases (escrow)
- [ ] Partial claims (split claiming)
- [ ] Purchase cancellation/refund mechanism
- [ ] Conditional purchases (oracle integration)
- [ ] Multi-recipient purchases
- [ ] Recurring purchases (subscriptions)
- [ ] Purchase notes (encrypted messages)
- [ ] NFT receipt system

### Phase 4: DeFi Integration (Q4 2025)
- [ ] DEX integration for instant swaps
- [ ] Liquidity pool support
- [ ] Yield farming with private positions
- [ ] Lending/borrowing with private collateral
- [ ] Private order books
- [ ] Cross-chain bridge integration
- [ ] DAO governance with private voting
- [ ] Staking with hidden amounts

### Phase 5: Enterprise & Scale (2026)
- [ ] B2B payment solutions
- [ ] Invoice system with encrypted amounts
- [ ] Multi-signature support
- [ ] Organizational account management
- [ ] Compliance tooling (selective disclosure)
- [ ] API for third-party integration
- [ ] SDK for developers
- [ ] White-label solution

### Phase 6: Advanced Privacy (Future)
- [ ] IP address anonymization
- [ ] Tor/I2P integration for frontend
- [ ] Decentralized relayer network
- [ ] Zero-knowledge proof integration
- [ ] Confidential smart contract calls
- [ ] Private smart contract upgrades
- [ ] Encrypted event logs
- [ ] Quantum-resistant encryption migration

### Performance Optimizations
- [ ] Gas optimization (target 30% reduction)
- [ ] Frontend bundle size reduction
- [ ] Lazy loading for encryption SDK
- [ ] Caching strategy improvements
- [ ] Batch transaction support
- [ ] Layer 2 deployment (optimistic rollups)
- [ ] FHEVM performance improvements (as Zama releases updates)

### Community & Ecosystem
- [ ] Developer documentation site
- [ ] Video tutorials and demos
- [ ] Hackathon participation
- [ ] Grant program for integrations
- [ ] Ambassador program
- [ ] Bug bounty program
- [ ] Regular community calls
- [ ] Open-source contribution guidelines

### Security & Compliance
- [ ] Third-party security audit
- [ ] Formal verification of critical functions
- [ ] Penetration testing
- [ ] GDPR compliance documentation
- [ ] Regulatory consultation
- [ ] Insurance coverage (Nexus Mutual)
- [ ] Emergency response plan
- [ ] Incident disclosure policy

## Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **Report Bugs**: Open an issue describing the bug and how to reproduce it
2. **Suggest Features**: Share your ideas for new features or improvements
3. **Submit Pull Requests**: Fix bugs or implement new features
4. **Improve Documentation**: Help make our docs clearer and more comprehensive
5. **Write Tests**: Increase test coverage and add edge case testing
6. **Share Feedback**: Tell us about your experience using FHE Trade

### Development Workflow

1. **Fork the repository**

   Click "Fork" on GitHub to create your copy

2. **Clone your fork**

   ```bash
   git clone https://github.com/yourusername/fhe-trade.git
   cd fhe-trade
   ```

3. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**

   - Write clear, commented code
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation as needed

5. **Test your changes**

   ```bash
   npm run compile
   npm test
   npm run lint
   ```

6. **Commit with clear messages**

   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

   Use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `test:` for tests
   - `refactor:` for refactoring
   - `chore:` for maintenance

7. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request**

   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template
   - Wait for review

### Code Style Guidelines

**Solidity**:
- Use Solidity ^0.8.24
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use NatSpec comments for all public functions
- Run `npm run lint` before committing

**TypeScript/JavaScript**:
- Use TypeScript for type safety
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Run `npm run lint` before committing

**Git Commits**:
- Write clear, descriptive commit messages
- Use Conventional Commits format
- Keep commits atomic (one logical change per commit)
- Reference issue numbers when applicable

### Testing Requirements

- All new features must include tests
- Maintain or improve code coverage (currently ~95%)
- Test both success and failure cases
- Include edge case testing
- Run full test suite before submitting PR

### Pull Request Checklist

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] New tests added for new functionality
- [ ] Documentation updated (if applicable)
- [ ] Code follows style guidelines
- [ ] Commit messages follow Conventional Commits
- [ ] No console.log or debugging code left in
- [ ] PR description clearly explains changes

### Getting Help

- **Discord**: Join our community (link coming soon)
- **GitHub Discussions**: Ask questions and share ideas
- **Documentation**: Check docs/ folder for detailed guides
- **Email**: contact@yourproject.com

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

See the [LICENSE](LICENSE) file for full details.

### Key Points

- Free to use, modify, and distribute
- Must preserve copyright notices
- Clear patent grant
- No trademark rights granted
- No warranty provided

### Third-Party Licenses

This project uses open-source libraries with the following licenses:

- **FHEVM**: BSD-3-Clause-Clear (Zama)
- **Hardhat**: MIT License
- **React**: MIT License
- **ethers.js**: MIT License
- **wagmi**: MIT License

See individual packages for their respective licenses.

## Support

### Getting Help

**Documentation**:
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [React Documentation](https://react.dev)
- [Wagmi Documentation](https://wagmi.sh)

**Community**:
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/fhe-trade/issues)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/yourusername/fhe-trade/discussions)
- **Discord**: Join our community server (link coming soon)
- **Twitter**: Follow us @FHETrade (link coming soon)

**Zama Resources**:
- [Zama Documentation](https://docs.zama.ai)
- [Zama Discord](https://discord.gg/zama)
- [Zama GitHub](https://github.com/zama-ai)

**Professional Support**:
- For commercial inquiries: business@yourproject.com
- For security issues: security@yourproject.com
- For partnerships: partnerships@yourproject.com

### Frequently Asked Questions

**Q: What is Fully Homomorphic Encryption?**
A: FHE allows computations to be performed on encrypted data without decrypting it first, ensuring privacy while maintaining functionality.

**Q: Is this production-ready?**
A: FHE Trade is currently in testnet phase. Do not use with real funds until mainnet launch and security audit completion.

**Q: What networks are supported?**
A: Currently Sepolia testnet. Mainnet support coming when Zama launches mainnet FHE.

**Q: How much does it cost to use?**
A: You only pay gas fees for transactions. There are no additional protocol fees.

**Q: Can I build on top of FHE Trade?**
A: Yes! The contracts are open-source and composable. See our developer documentation.

**Q: Is my data truly private?**
A: Yes, amounts and recipients are encrypted on-chain. However, transaction metadata (sender, timestamp, gas costs) is public.

**Q: What wallets are supported?**
A: Any Web3 wallet that supports Ethereum (MetaMask, WalletConnect, Coinbase Wallet, etc.)

**Q: How do I get Sepolia ETH?**
A: Use a [Sepolia Faucet](https://sepoliafaucet.com/) to get free testnet ETH.

---

## Acknowledgments

### Built With

- **Zama**: For the groundbreaking FHEVM technology
- **Hardhat**: For the excellent development framework
- **React Team**: For the amazing UI library
- **Ethereum Foundation**: For the blockchain infrastructure

### Contributors

Thank you to all contributors who have helped build FHE Trade!

(Contributors will be automatically listed here as they contribute)

### Inspiration

This project was inspired by the need for true financial privacy in decentralized systems while maintaining transparency and verifiability.

---

## Changelog

### v0.1.0 (Current)
- Initial release
- FHEPurchaseManager contract
- React frontend with purchase creation
- Balance viewing and decryption
- Sepolia deployment
- Comprehensive test suite

(See [CHANGELOG.md](CHANGELOG.md) for detailed version history)

---

**Built with privacy in mind. Powered by Fully Homomorphic Encryption.**

*For the latest updates, follow us on [GitHub](https://github.com/yourusername/fhe-trade).*
