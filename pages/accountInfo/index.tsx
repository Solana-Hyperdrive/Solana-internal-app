import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export default function BalanceDisplay() {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      'confirmed'
    );

    connection.getAccountInfo(publicKey).then((info) => {
      setBalance(info.lamports);
    });
  }, [connection, publicKey]);

  const sendSol = (event) => {
    event.preventDefault();

    const transaction = new web3.Transaction();
    const recipientPubKey = new web3.PublicKey(
      'CdL57WiSZsKpFveLpDF6NGLHJdhfNRDhuPRZH82vruGw'
    );

    console.log({ publicKey, recipientPubKey });

    const sendSolInstruction = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipientPubKey,
      lamports: LAMPORTS_PER_SOL * 0.1
    });

    transaction.add(sendSolInstruction);

    sendTransaction(transaction, connection)
      .then((sig) => {
        console.log(sig);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log({ balance, publicKey });

  return (
    <div>
      <p>{publicKey ? `Balance: ${balance / LAMPORTS_PER_SOL} SOL` : ''}</p>
      <button onClick={sendSol}>SEND</button>
    </div>
  );
}
