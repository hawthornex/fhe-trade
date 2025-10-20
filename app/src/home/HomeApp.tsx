import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { FHE_PURCHASE_MANAGER_ABI } from '../abi/FHEPurchaseManager';
import { Contract } from 'ethers';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string;

export function HomeApp() {
  const { address } = useAccount();
  const signerPromise = useEthersSigner();
  const { instance } = useZamaInstance();

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [decryptedBalance, setDecryptedBalance] = useState<string | null>(null);
  const [decrypting, setDecrypting] = useState(false);

  const { data: encBalance } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: FHE_PURCHASE_MANAGER_ABI,
    functionName: 'getEncryptedBalance',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!CONTRACT_ADDRESS },
  });

  const handlePurchase = async () => {
    if (!address) return alert('Connect wallet');
    if (!instance) return alert('Encryption service not ready');
    if (!CONTRACT_ADDRESS) return alert('Missing contract address');
    const value = Number(amount);
    if (!Number.isInteger(value) || value <= 0) return alert('Amount must be a positive integer');
    if (!/^0x[0-9a-fA-F]{40}$/.test(recipient)) return alert('Invalid recipient address');

    setSubmitting(true);
    setTxHash(null);
    try {
      // Prepare encrypted inputs
      const input = instance
        .createEncryptedInput(CONTRACT_ADDRESS, address)
        .add32(BigInt(value))
        .add256(BigInt(recipient));
      const encrypted = await input.encrypt();

      const signer = await signerPromise;
      if (!signer) throw new Error('Signer not available');
      const contract = new Contract(CONTRACT_ADDRESS, FHE_PURCHASE_MANAGER_ABI as any, signer);
      const tx = await contract.purchase(encrypted.handles[0], encrypted.inputProof, encrypted.handles[1], encrypted.inputProof);
      const receipt = await tx.wait();
      setTxHash(tx.hash);
      if (receipt?.status !== 1) throw new Error('Transaction failed');
      alert('Purchase submitted');
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Failed to submit purchase');
    } finally {
      setSubmitting(false);
    }
  };

  const decryptMyBalance = async () => {
    if (!instance || !address) return;
    if (!encBalance) return alert('No encrypted balance available');
    setDecrypting(true);
    try {
      const handle = encBalance as string;
      const keypair = instance.generateKeypair();
      const contractAddresses = [CONTRACT_ADDRESS];
      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '10';

      const eip712 = instance.createEIP712(keypair.publicKey, contractAddresses, startTimeStamp, durationDays);
      const signer = await signerPromise;
      if (!signer) throw new Error('Signer not available');
      const signature = await signer.signTypedData(
        eip712.domain,
        { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        eip712.message
      );

      const result = await instance.userDecrypt(
        [{ handle, contractAddress: CONTRACT_ADDRESS }],
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address,
        startTimeStamp,
        durationDays
      );
      const clear = result[handle];
      setDecryptedBalance(clear || '0');
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Failed to decrypt');
    } finally {
      setDecrypting(false);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>FHE Purchase</h2>
        <ConnectButton />
      </header>

      <section style={{ background: '#fff', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 24 }}>
        <h3 style={{ marginTop: 0 }}>Create Purchase</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          <label>
            <div>Amount</div>
            <input
              type="number"
              min={1}
              step={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', padding: 8 }}
            />
          </label>
          <label>
            <div>Recipient Address</div>
            <input
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{ width: '100%', padding: 8 }}
            />
          </label>
          <button onClick={handlePurchase} disabled={submitting} style={{ padding: '8px 12px' }}>
            {submitting ? 'Submitting...' : 'Submit Purchase'}
          </button>
          {txHash && (
            <div style={{ fontSize: 12, color: '#4b5563' }}>Tx: {txHash}</div>
          )}
        </div>
      </section>

      <section style={{ background: '#fff', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <h3 style={{ marginTop: 0 }}>My Balance</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <div>Encrypted Handle</div>
            <code style={{ fontSize: 12 }}>{(encBalance as string) || '0x00'}</code>
          </div>
          <div>
            <button onClick={decryptMyBalance} disabled={decrypting || !encBalance} style={{ padding: '8px 12px' }}>
              {decrypting ? 'Decrypting...' : 'Decrypt My Balance'}
            </button>
            {decryptedBalance !== null && (
              <div style={{ marginTop: 8 }}>Balance: {decryptedBalance}</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
