import { useEffect, useState } from "react";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { Address, beginCell } from "@ton/core";

interface JettonBalance {
  balance: bigint;
}

export function useJettonContract(jettonMasterAddress: string) {
  const client = useTonClient();
  const { wallet } = useTonConnect();

  const [jettonBalance, setJettonBalance] = useState<JettonBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchJettonBalance() {
      if (!client || !wallet) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get jetton wallet address
        const userAddress = Address.parse(wallet);
        const jettonMasterContractAddress = Address.parse(jettonMasterAddress);
        
        const { stack } = await client.callGetMethod(jettonMasterContractAddress, "get_wallet_address", [
          { type: "slice", cell: beginCell().storeAddress(userAddress).endCell() }
        ]);
        const jettonWalletAddress = stack.readAddress();

        // Get wallet data
        const { stack: walletStack } = await client.callGetMethod(jettonWalletAddress, "get_wallet_data");
        const balance = walletStack.readBigNumber();

        setJettonBalance({ balance });
      } catch (err) {
        console.error('Error fetching jetton balance:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchJettonBalance();
    intervalId = setInterval(fetchJettonBalance, 5000); // Обновляем данные каждые 5 секунд

    return () => clearInterval(intervalId);
  }, [client, wallet, jettonMasterAddress]);

  return {
    jettonBalance,
    loading,
    error,
  };
}