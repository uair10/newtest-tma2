import { useState, useEffect } from 'react';
import { Address, TonClient, beginCell } from '@ton/ton';
import { useTonConnect } from './useTonConnect';
import { Cell } from '@ton/core';
import { useTonAddress } from '@tonconnect/ui-react';

interface JettonData {
  balance: bigint;
  owner: Address;
  jettonCode: Cell | null;
  walletCode: Cell;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getJettonData(minterAddress: string): Promise<JettonData> {
  const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
  });

  await sleep(1500);
  const response = await client.runMethod(Address.parse(minterAddress), "get_wallet_data", []);

  const balance = response.stack.readBigNumber();
  const owner = response.stack.readAddress();
  let jettonCode: Cell | null;
  try {
    jettonCode = response.stack.readCell();
  } catch (error) {
    jettonCode = null;
  }
  const walletCode = response.stack.readCell();

  return {
    balance,
    owner,
    jettonCode,
    walletCode
  };
}

async function calculateJettonWalletAddress(minterAddress: string, ownerAddress: Address): Promise<string> {
  const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
  });
  
  await sleep(1500);
  const response = await client.runMethod(Address.parse(minterAddress), "get_wallet_address", [
    {
      type: 'slice',
      cell: beginCell().storeAddress(ownerAddress).endCell()
    }
  ]);
  return response.stack.readAddress().toString();
}

export function useJettonBalance(jettonMasterAddress: string) {
  const [jettonData, setJettonData] = useState<JettonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { wallet } = useTonConnect();
  const userFriendlyAddress = useTonAddress();

  useEffect(() => {
    async function fetchJettonData() {
      if (!wallet || !jettonMasterAddress) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const userAddress = Address.parse(userFriendlyAddress);
        const userJettonWalletAddress = await calculateJettonWalletAddress(jettonMasterAddress, userAddress);
        
        const data = await getJettonData(userJettonWalletAddress);
        setJettonData(data);
      } catch (err) {
        console.error('Error fetching jetton data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchJettonData();
  }, [wallet, jettonMasterAddress]);

  return { jettonData, loading, error };
}