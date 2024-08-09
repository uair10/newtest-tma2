import React from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import './MainApp6.css';
import unicornImage from './unicorn.png';
import FooterMenu from '../FooterMenu/FooterMenu';

const MainApp6: React.FC = () => {
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
      </div>
      <FooterMenu />
    </div>
  );
};

export default MainApp6;