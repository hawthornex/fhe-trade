import { useEffect, useMemo, useState } from 'react';
import { useAccount, usePublicClient, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { FHE_PURCHASE_MANAGER_ABI } from '../abi/FHEPurchaseManager';
import { Contract } from 'ethers';
import '../styles/HomeApp.css';

const CONTRACT_ADDRESS = "0x5FdEb51a92548b3649Db400cA456d0d3D87675ea";

export function HomeApp() {
  const { address } = useAccount();
  const signerPromise = useEthersSigner();
  const { instance } = useZamaInstance();
  const publicClient = usePublicClient();

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [decryptedBalance, setDecryptedBalance] = useState<string | null>(null);
  const [decrypting, setDecrypting] = useState(false);

  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<
    Array<{
      id: number;
      buyer: string;
      remainingHandle: string;
      recipientHandle: string;
      remainingPlain?: string;
      recipientPlain?: string;
    }>
  >([]);
  const [decryptingPurchases, setDecryptingPurchases] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);

  const { data: encBalance } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: FHE_PURCHASE_MANAGER_ABI,
    functionName: 'getEncryptedBalance',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!CONTRACT_ADDRESS },
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!publicClient) return;
      setLoadingPurchases(true);
      setPurchaseError(null);
      try {
        const countResult = await publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: FHE_PURCHASE_MANAGER_ABI,
          functionName: 'getPurchaseCount',
        });
        const count = Number(countResult as bigint);
        if (count === 0) {
          if (!cancelled) setPurchases([]);
          return;
        }
        const entries = await Promise.all(
          Array.from({ length: count }, (_, index) =>
            publicClient.readContract({
              address: CONTRACT_ADDRESS as `0x${string}`,
              abi: FHE_PURCHASE_MANAGER_ABI,
              functionName: 'getPurchase',
              args: [BigInt(index)],
            })
          )
        );
        if (!cancelled) {
          const normalized = entries.map((entry, index) => {
            const [buyer, remaining, recipient] = entry as [string, string, string];
            return {
              id: index,
              buyer,
              remainingHandle: remaining,
              recipientHandle: recipient,
            };
          });
          setPurchases(normalized);
        }
      } catch (error: any) {
        console.error('Failed to load purchases', error);
        if (!cancelled) {
          setPurchaseError(error?.message || 'Failed to load purchases');
          setPurchases([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingPurchases(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [publicClient, txHash, address]);

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

  const normalizeRecipientAddress = (value: string | undefined) => {
    if (!value) return undefined;
    try {
      const big = value.startsWith('0x') ? BigInt(value) : BigInt(value);
      const hex = big.toString(16).padStart(40, '0');
      return `0x${hex}`;
    } catch (err) {
      console.error('Failed to normalize recipient address', err);
      return undefined;
    }
  };

  const normalizeAmount = (value: string | undefined) => {
    if (!value) return undefined;
    try {
      const big = value.startsWith('0x') ? BigInt(value) : BigInt(value);
      return big.toString();
    } catch (err) {
      console.error('Failed to normalize amount', err);
      return value;
    }
  };

  const decryptPurchases = async () => {
    if (!instance || !address) {
      alert('Connect wallet and ensure encryption service is ready');
      return;
    }
    if (!purchases.length) {
      alert('No purchases to decrypt');
      return;
    }

    const handles = new Map<string, { handle: string; contractAddress: string }>();
    purchases.forEach((p) => {
      if (!handles.has(p.remainingHandle)) {
        handles.set(p.remainingHandle, { handle: p.remainingHandle, contractAddress: CONTRACT_ADDRESS });
      }
      if (!handles.has(p.recipientHandle)) {
        handles.set(p.recipientHandle, { handle: p.recipientHandle, contractAddress: CONTRACT_ADDRESS });
      }
    });

    if (handles.size === 0) {
      alert('No handles available for decryption');
      return;
    }

    setDecryptingPurchases(true);
    setDecryptError(null);
    try {
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
        Array.from(handles.values()),
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address,
        startTimeStamp,
        durationDays
      );

      setPurchases((prev) =>
        prev.map((p) => {
          const remainingClear = result[p.remainingHandle];
          const recipientClear = result[p.recipientHandle];
          return {
            ...p,
            remainingPlain: normalizeAmount(remainingClear ?? p.remainingPlain),
            recipientPlain: normalizeRecipientAddress(recipientClear ?? p.recipientPlain),
          };
        })
      );
    } catch (err: any) {
      console.error('Failed to decrypt purchases', err);
      setDecryptError(err?.message || 'Failed to decrypt purchases');
      alert(err?.message || 'Failed to decrypt purchases');
    } finally {
      setDecryptingPurchases(false);
    }
  };

  const normalizedAddress = address?.toLowerCase();
  const sentPurchases = useMemo(
    () =>
      normalizedAddress
        ? purchases.filter((p) => p.buyer.toLowerCase() === normalizedAddress)
        : [],
    [normalizedAddress, purchases]
  );

  const receivedPurchases = useMemo(
    () =>
      normalizedAddress
        ? purchases.filter((p) => p.recipientPlain && p.recipientPlain.toLowerCase() === normalizedAddress)
        : [],
    [normalizedAddress, purchases]
  );

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
    <div className="home-container">
      <header className="home-header">
        <div>
          <h1 className="home-title">🔐 FHE Trade</h1>
          <p className="home-subtitle">Privacy-Preserving Decentralized Trading Platform</p>
        </div>
        <ConnectButton />
      </header>

      <section className="card">
        <h3 className="card-title">
          <span className="card-title-icon">💳</span>
          Create Purchase
        </h3>
        <div className="form-grid">
          <div>
            <label className="form-label">Amount</label>
            <input
              type="number"
              min={1}
              step={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input"
              placeholder="Enter amount..."
            />
          </div>
          <div>
            <label className="form-label">Recipient Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="form-input"
            />
          </div>
          <button onClick={handlePurchase} disabled={submitting} className="btn btn-primary">
            {submitting && <span className="loading-spinner"></span>}
            {submitting ? 'Submitting...' : 'Submit Purchase'}
          </button>
          {txHash && (
            <div className="tx-hash">
              <strong>Transaction:</strong> {txHash}
            </div>
          )}
        </div>
      </section>

      <section className="card">
        <h3 className="card-title">
          <span className="card-title-icon">📦</span>
          Purchase Requests
        </h3>
        <div className="form-grid">
          <div className="section-header">
            <button onClick={decryptPurchases} disabled={decryptingPurchases} className="btn btn-secondary">
              {decryptingPurchases && <span className="loading-spinner"></span>}
              {decryptingPurchases ? 'Decrypting...' : '🔓 Decrypt Purchases'}
            </button>
            <div>
              {loadingPurchases && <span className="status-text">Loading purchases...</span>}
              {purchaseError && <span className="status-text status-error">{purchaseError}</span>}
              {decryptError && !purchaseError && <span className="status-text status-error">{decryptError}</span>}
            </div>
          </div>

          <div className="purchase-section">
            <h4 className="purchase-section-title">📤 Sent by Me</h4>
            {sentPurchases.length === 0 ? (
              <div className="empty-state">No purchases submitted yet.</div>
            ) : (
              <div className="purchases-grid">
                {sentPurchases.map((p) => (
                  <div key={p.id} className="purchase-card">
                    <div className="purchase-card-header">Purchase #{p.id}</div>
                    <div className="purchase-card-detail">
                      <strong>Buyer:</strong>
                      <span>{p.buyer.slice(0, 6)}...{p.buyer.slice(-4)}</span>
                    </div>
                    <div className="purchase-card-detail">
                      <strong>Recipient:</strong>
                      <span>{p.recipientPlain ? `${p.recipientPlain.slice(0, 6)}...${p.recipientPlain.slice(-4)}` : '🔒 Encrypted'}</span>
                    </div>
                    <div className="purchase-card-detail">
                      <strong>Remaining:</strong>
                      <span>{p.remainingPlain || '🔒 Encrypted'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="purchase-section">
            <h4 className="purchase-section-title">📥 Received by Me</h4>
            {normalizedAddress ? (
              receivedPurchases.length === 0 ? (
                <div className="empty-state">
                  {decryptingPurchases || purchases.length === 0
                    ? 'Decrypt purchases to reveal incoming requests.'
                    : 'No purchase requests found for your address.'}
                </div>
              ) : (
                <div className="purchases-grid">
                  {receivedPurchases.map((p) => (
                    <div key={p.id} className="purchase-card">
                      <div className="purchase-card-header">Purchase #{p.id}</div>
                      <div className="purchase-card-detail">
                        <strong>Buyer:</strong>
                        <span>{p.buyer.slice(0, 6)}...{p.buyer.slice(-4)}</span>
                      </div>
                      <div className="purchase-card-detail">
                        <strong>Remaining:</strong>
                        <span>{p.remainingPlain || '🔒 Encrypted'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="empty-state">Connect a wallet to view received purchases.</div>
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="card-title">
          <span className="card-title-icon">💰</span>
          My Balance
        </h3>
        <div className="form-grid">
          <div className="balance-display">
            <div className="balance-label">Encrypted Handle</div>
            <div className="balance-value">{(encBalance as string) || '0x00'}</div>
          </div>
          <div>
            <button onClick={decryptMyBalance} disabled={decrypting || !encBalance} className="btn btn-primary">
              {decrypting && <span className="loading-spinner"></span>}
              {decrypting ? 'Decrypting...' : '🔓 Decrypt My Balance'}
            </button>
            {decryptedBalance !== null && (
              <div className="balance-result">Balance: {decryptedBalance}</div>
            )}
          </div>
        </div>
      </section>

      <section className="card gameplay-card">
        <h3 className="card-title">
          <span className="card-title-icon">🎮</span>
          How It Works
        </h3>
        <p className="gameplay-description">
          Follow these steps to experience the encrypted purchase flow powered by Zama FHE.
        </p>
        <ol className="gameplay-steps">
          <li>Connect wallet A and wait for the Zama encryption service to be ready.</li>
          <li>Enter the purchase amount and recipient wallet B; both values are encrypted client-side before submission.</li>
          <li>Submit the purchase to store the encrypted balance mapping without minting or transferring actual tokens.</li>
          <li>Use the decrypt feature with your wallet to reveal the clear balance that the contract tracks for you.</li>
        </ol>
      </section>
    </div>
  );
}
