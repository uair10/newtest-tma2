import React from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import './MainApp6.css';
import unicornImage from './unicorn.png';
import FooterMenu from '../FooterMenu/FooterMenu';
import { useJettonContract } from '../hooks/useJettonContract';
import { useTonConnect } from '../hooks/useTonConnect';

const MainApp6: React.FC = () => {
  const jettonMasterAddress = "EQA3LxaRQBzZ_QzPsx16EAJ_AchJl0wt4r33Jf0NBofSmOY8d";
  const { jettonBalance, loading, error } = useJettonContract(jettonMasterAddress);
  const { connected } = useTonConnect();

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
          ) : jettonBalance ? (
            <p>Jetton Balance: {jettonBalance.balance.toString()}</p>
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