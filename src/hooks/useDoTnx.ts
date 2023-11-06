import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';

function useDoTnx() {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  useEffect(() => {
    if (!connection || !publicKey) return;

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

  const sendSol = async (recPubKey, amount: number) => {
    if (amount > balance / LAMPORTS_PER_SOL)
      throw new Error('Insufficient Balance');

    const transaction = new web3.Transaction();
    const recipientPubKey = new web3.PublicKey(recPubKey);

    const sendSolInstruction = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipientPubKey,
      lamports: LAMPORTS_PER_SOL * amount
    });

    transaction.add(sendSolInstruction);

    return sendTransaction(transaction, connection);
  };

  return { balance, sendSol };
}

export default useDoTnx;
