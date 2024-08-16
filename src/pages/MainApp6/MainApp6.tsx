import React from 'react';
import { TonConnectButton, /*useTonAddress*/} from '@tonconnect/ui-react';
import './MainApp6.css';
import unicornImage from './unicorn.png';
import FooterMenu from '../FooterMenu/FooterMenu';
import { useJettonBalance } from '../hooks/useJettonBalance1';
// import { useMainContract } from '../hooks/useMainContract';


const MainApp6: React.FC = () => {
  // const wallet = useTonWallet();
  //const userFriendlyAddress = useTonAddress();
  //const { jetton_balance } = useMainContract()
/*  <div>{userFriendlyAddress}</div>
{jetton_balance !== null && (
  <div>Jetton Balance: {jetton_balance.toString()}</div>
)}
*/

  const jettonMasterAddress = 'EQA3LxaRQBzZ_QzPsx16EAJ_AchJl0wt4r33Jf0NBofSmOY8'; // Адрес мастер-контракта жетона
  const { jettonData, loading, error } = useJettonBalance(jettonMasterAddress);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!jettonData) return <div>No data available</div>;

  return (
    <div className="main-app-container">
      <div className="ellipse"></div>
      <div className="header"></div>
      <div className="content">
        <img src={unicornImage} alt="Единорог" className="unicorn-image" />
        <p>Balance: {jettonData.balance.toString()}</p>
        <p>Owner: {jettonData.owner.toString()}</p>
       
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