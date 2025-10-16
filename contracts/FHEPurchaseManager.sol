// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, euint256, ebool, externalEuint32, externalEuint256} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title FHE-based purchase manager
/// @notice Records encrypted purchase requests and lets the correct recipient privately claim once
contract FHEPurchaseManager is SepoliaConfig {
    struct Purchase {
        address buyer;
        euint32 remaining; // remaining amount that can be claimed (encrypted)
        euint256 recipient; // encrypted recipient address (as uint256)
    }

    Purchase[] private _purchases;

    // Encrypted balances per user
    mapping(address => euint32) private _balances;

    /// @notice Create a purchase for an encrypted recipient with an encrypted amount.
    /// @param encAmount Encrypted amount (handle)
    /// @param amountProof Input proof for amount
    /// @param encRecipient Encrypted recipient address represented as uint256 (handle)
    /// @param recipientProof Input proof for recipient
    /// @return id Purchase id
    function purchase(
        externalEuint32 encAmount,
        bytes calldata amountProof,
        externalEuint256 encRecipient,
        bytes calldata recipientProof
    ) external returns (uint256 id) {
        euint32 amount = FHE.fromExternal(encAmount, amountProof);
        euint256 recipient = FHE.fromExternal(encRecipient, recipientProof);

        // Initialize purchase with remaining = amount
        Purchase memory p = Purchase({buyer: msg.sender, remaining: amount, recipient: recipient});

        // Allow contract to operate on ciphertexts later
        FHE.allowThis(p.remaining);
        FHE.allowThis(p.recipient);

        _purchases.push(p);
        id = _purchases.length - 1;
    }

    /// @notice Claim a list of purchases for the caller. Only the rightful recipient gets credited once.
    /// @param ids List of purchase ids to process
    function claim(uint256[] calldata ids) external {
        uint256 len = ids.length;
        for (uint256 i = 0; i < len; i++) {
            uint256 id = ids[i];
            require(id < _purchases.length, "invalid id");
            Purchase storage p = _purchases[id];

            // Compute equality under FHE: (p.recipient == msg.sender)
            euint256 callerEnc = FHE.asEuint256(uint256(uint160(msg.sender)));
            ebool isRecipient = FHE.eq(p.recipient, callerEnc);

            // Add 'remaining' to caller's balance if isRecipient, otherwise add 0
            euint32 zero = FHE.asEuint32(0);
            euint32 addend = FHE.select(isRecipient, p.remaining, zero);
            _balances[msg.sender] = FHE.add(_balances[msg.sender], addend);

            // Set remaining to 0 if isRecipient, otherwise leave unchanged
            p.remaining = FHE.select(isRecipient, zero, p.remaining);

            // Maintain ACL so caller can decrypt their balance
            FHE.allowThis(_balances[msg.sender]);
            FHE.allow(_balances[msg.sender], msg.sender);
            // Keep ACL for remaining to allow future operations
            FHE.allowThis(p.remaining);
        }
    }

    /// @notice Returns the encrypted balance of a user.
    /// @dev Do not use msg.sender in view (as per requirements).
    function getEncryptedBalance(address user) external view returns (euint32) {
        return _balances[user];
    }

    /// @notice Get total number of purchases recorded.
    function getPurchaseCount() external view returns (uint256) {
        return _purchases.length;
    }

    /// @notice Returns a purchase record.
    /// @dev Returns encrypted fields as handles; frontends can use Relayer for decryption when permitted.
    function getPurchase(uint256 id) external view returns (address buyer, euint32 remaining, euint256 recipient) {
        require(id < _purchases.length, "invalid id");
        Purchase storage p = _purchases[id];
        return (p.buyer, p.remaining, p.recipient);
    }
}
