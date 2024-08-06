import React from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useLocation } from 'react-router-dom';
import './MainApp6.css';
import unicornImage from './unicorn.png';
import FooterMenu from '../FooterMenu/FooterMenu'; // Импортируйте новый компонент

const MainApp6: React.FC = () => {
  const location = useLocation();

  const renderContent = () => {
    switch(location.pathname) {
      case '/shop':
        return <div>Содержимое магазина</div>;
      case '/clipboard':
        return <div>Содержимое буфера обмена</div>;
      case '/bag':
        return <div>Содержимое сумки</div>;
      case '/profile':
        return <div>Содержимое профиля</div>;
      case '/info':
        return <div>Информационное содержимое</div>;
      default:
        return (
          <>
            <img src={unicornImage} alt="Единорог" className="unicorn-image" />
            <h1 className="title">LEVELLING UP</h1>
            <p className="description">
              Connect your wallet to access upcoming crypto features. Our team is working hard to bring them to you soon!
            </p>
            <div className="button-wrapper">
              <TonConnectButton className="custom-ton-button" />
            </div>
          </>
        );
    }
  };

  return (
    <div className="main-app-container">
      <div className="ellipse"></div>
      <div className="header"></div>
      <div className="content">
        {renderContent()}
      </div>
      <FooterMenu />
    </div>
  );
};

export default MainApp6;
