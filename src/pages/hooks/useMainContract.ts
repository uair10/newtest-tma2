import { useEffect, useState } from "react";

import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "@ton/core";
import { JettonWallet } from "@/wrappers/JettonWallet";
import { Cell } from "@ton/ton";
import { useTonAddress } from "@tonconnect/ui-react";

export function useMainContract() {
  const client = useTonClient();
  const userFriendlyAddress = useTonAddress();

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const [contractData, setContractData] = useState<null | {
    jetton_balance: number,
    owner_address: Address,
    jetton_master_address: Address
    jetton_wallet_code: Cell
  }>();

  const [balance, setBalance] = useState<null | number>(0);

  const jettonWallet = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new JettonWallet(
      Address.parse(userFriendlyAddress) 
    );
    return client.open(contract) as OpenedContract<JettonWallet>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!jettonWallet) return;
      setContractData(null);
      const val = await jettonWallet.getWalletData();
      setContractData({
        jetton_balance: val.jetton_balance,
        owner_address: val.owner_address,
        jetton_master_address: val.jetton_master_address,
        jetton_wallet_code: val.jetton_wallet_code,
      });
      setBalance(val.jetton_balance)
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [jettonWallet]);

  return {
    contract_address: jettonWallet?.address.toString(),
    jetton_balance: balance,
    ...contractData,
  }
}