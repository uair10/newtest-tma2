import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import ticketDiscount from "./ticket-discount.png";
import './ReferalSystem.css';
import FooterMenu from '../FooterMenu/FooterMenu';
import { initUtils } from '@telegram-apps/sdk';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          start_param?: string;
          user?: {
            id: string;
          };
        };
      };
    };
  }
}

interface Friend {
  id: string;
  name: string;
  points: number;
}

const ReferralSystem: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [referralLink, setReferralLink] = useState('');
  const [referrals, setReferrals] = useState<string[]>([]);

  useEffect(() => {
    // Получаем Telegram ID пользователя
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || "defaultId";
    const botUsername = "tma123_bot"; // Замените на имя вашего бота
    const newReferralLink = `https://t.me/${botUsername}/start?startapp=kentId${userId}`;
    setReferralLink(newReferralLink);

    // Проверяем start_param при загрузке
    const webApp = window.Telegram?.WebApp;
    if (webApp?.initDataUnsafe?.start_param) {
      const startParam = webApp.initDataUnsafe.start_param;
      if (startParam.startsWith('kentId')) {
        const referrerId = startParam.slice(6); // Удаляем 'kentId' из начала
        handleReferral(referrerId);
      }
    }

    // Загружаем данные о друзьях
    fetchFriends();
  }, []);

  useEffect(() => {
    const total = friends.reduce((sum, friend) => sum + friend.points, 0);
    setTotalPoints(total);
  }, [friends]);

  const fetchFriends = async () => {
    // Замените это на реальный API-вызов
    const mockFriends: Friend[] = [
      { id: '1', name: 'OyVeyLaVey', points: 89923 },
      { id: '2', name: 'sonicx123', points: 89923 },
      { id: '3', name: 'OyVeyLaVey', points: 89923 },
      { id: '4', name: 'sonicx123', points: 89923 },
    ];
    setFriends(mockFriends);
  };

  const handleReferral = (referrerId: string) => {
    // Здесь вы бы отправили запрос на ваш бэкенд для обработки реферала
    console.log(`Обработка реферала от пользователя: ${referrerId}`);
    setReferrals(prev => [...prev, referrerId]);
  };

  const handleInviteFriend = () => {
    const utils = initUtils();
    utils.shareURL(
      referralLink,
      'Залетай в моё супер приложение!'
    );
  };

  return (
    <div className="referral-container">
      <div className="info-card">
        <p> 
          Score 10% from buddies + 2.5% from their referrals.
        </p>
        <p>
          Get a <img className="ticket-discount" src={ticketDiscount} alt="Ticket discount"/> play pass for each fren.
        </p>
      </div>
  
      <div className="friends-list">
        <h3>{friends.length} Frens</h3>
        <ul>
          {friends.map((friend) => (
            <li key={friend.id} className="friend-item">
              <div className="friend-info">
                <div className="friend-avatar">
                  {friend.name[0].toUpperCase()}
                </div>
                <span>{friend.name}</span>
              </div>
              <span className="friend-points">{friend.points} BP</span>
            </li>
          ))}
        </ul>
      </div>
      
      <button
        onClick={handleInviteFriend}
        className="invite-button"
      >
        Invite a fren
      </button>
      
      <div className="referral-link">
        <AlertCircle />
        <p>
          Your referral link: {referralLink}
        </p>
      </div>

      <div className="referrals-info">
        <h3>Invited frens: {referrals.length}</h3>
        <ul>
          {referrals.map((referralId, index) => (
            <li key={index}>Fren ID: {referralId}</li>
          ))}
        </ul>
      </div>

      <div className="total-points">
        <h3>Total Points: {totalPoints}</h3>
      </div>
      <div>
        <FooterMenu />
      </div>
    </div>
  );
};

export default ReferralSystem;