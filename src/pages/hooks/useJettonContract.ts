// import { useEffect, useState } from "react";
// import { useTonClient } from "./useTonClient";
// import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract } from "@ton/core";
import { JettonMaster, JettonWallet, TonClient } from "@ton/ton";


export async function getJettonBalance(jetton_wallet_address: Address, client: TonClient | undefined): Promise<bigint | undefined> {
  if (!client) {
    console.error("TonClient is not initialized");
    return undefined;
  }

  const jetton_wallet: JettonWallet = JettonWallet.create(jetton_wallet_address);
  const openedContract = client.open(jetton_wallet) as OpenedContract<JettonWallet>;
  return await openedContract.getBalance();
}

export const getWalletAddress = async (
    user_address: Address,
    jetton_master_address: string,
    client: TonClient
  ): Promise<Address | undefined> => {
    if (!client) {
      console.error("TonClient is not initialized");
      return undefined;
    }

    try {
      const contract = JettonMaster.create(
        Address.parse(jetton_master_address)
      );
      const openedContract = client.open(
        contract
      ) as OpenedContract<JettonMaster>;
      const jetton_wallet_address: Address | undefined =
        await openedContract.getWalletAddress(user_address);

      if (!jetton_wallet_address) {
        console.error("Failed to get jetton wallet address");
        return undefined;
      }

      return jetton_wallet_address;
    } catch (error) {
      console.error("Error in getWalletAddress:", error);
      return undefined;
    }
  };
