import React, { useState, useEffect } from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import './MainApp6.css';
import unicornImage from './unicorn.png';
import FooterMenu from '../FooterMenu/FooterMenu';
import { Address } from "@ton/ton";
import { getWalletAddress, getJettonBalance } from '../hooks/useJettonContract';
import { useTonConnect } from '../hooks/useTonConnect';
import { useTonClient } from '../hooks/useTonClient';
import { fromNano } from '@ton/core';

const MainApp6: React.FC = () => {
  const jettonMasterAddress = "EQA3LxaRQBzZ_QzPsx16EAJ_AchJl0wt4r33Jf0NBofSmOY8";
  const [jettonBalance, setJettonBalance] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { connected, wallet } = useTonConnect();
  const client = useTonClient();

  useEffect(() => {
    const fetchJettonBalance = async () => {
      if (!connected || !wallet || !client) return;

      try {
        setLoading(true);

        const parsedUserAddress = Address.parse(wallet);
        const jettonWalletAddress = await getWalletAddress(parsedUserAddress, jettonMasterAddress, client);

        if (jettonWalletAddress) {
          const balance = await getJettonBalance(jettonWalletAddress, client);
          if (balance !== undefined) {
            // Преобразуем баланс из наноединиц в обычные единицы
            setJettonBalance(fromNano(balance));
          } else {
            setJettonBalance(undefined);
          }
        } else {
          setError('Failed to retrieve jetton wallet address.');
        }
      } catch (err) {
        setError('Failed to load jetton balance.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (connected) {
      fetchJettonBalance();
    }
  }, [connected, wallet, client]);

  return (
    <div className="main-app-container">
      <div className="ellipse"></div>
      <div className="header"></div>
      <div className="content">
        <img src={unicornImage} alt="Единорог" className="unicorn-image" />
        <h1 className="title">LEVELLING UP</h1>
        <p className="description">
          Connect your wallet to access upcoming crypto features. Our team is working hard to bring them to you soon!
        </p>
        <div className="button-wrapper">
          <TonConnectButton className="custom-ton-button" />
        </div>
        {connected ? (
          loading ? (
            <p>Loading jetton balance...</p>
          ) : error ? (
            <p>Error loading jetton balance: {error}</p>
          ) : jettonBalance !== undefined ? (
            <p className ="jetton-balance">Jetton Balance: {jettonBalance}</p>
          ) : (
            <p>No jetton balance available</p>
          )
        ) : (
          <p>Connect your wallet to view jetton balance</p>
        )}
      </div>
      <FooterMenu />
    </div>
  );
};

export default MainApp6;