import React, { useState, useEffect } from 'react';
import { initUtils, useInitData, useLaunchParams } from '@telegram-apps/sdk-react';
import './ReferalSystem.css';
import FooterMenu from '../FooterMenu/FooterMenu';
import ticketDiscount from "./ticket-discount.png";

interface Referral {
  id: number;
  date: string;
  user_tg_id: number;
  friend_tg_id: number;
  points: number;
}

const API_BASE_URL = 'https://547a-38-180-23-221.ngrok-free.app'; // Replace with your actual backend URL

const ReferralSystem: React.FC = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [referralLink, setReferralLink] = useState('');

  const initData = useInitData();
  const { startParam } = useLaunchParams();

  useEffect(() => {
    const initApp = async () => {
      if (initData?.user) {
        const userId = initData.user.id;

        if (userId) {
          // Создание реферальной ссылки
          const botUsername = "tma123_bot";
          const newReferralLink = `https://t.me/${botUsername}?startapp=${userId}`;
          setReferralLink(newReferralLink);

          // Проверка наличия стартового параметра (реферальной ссылки)
          console.log('Start Parameter:', startParam);
          if (startParam) {
            const referrerId = parseInt(startParam, 10);
            if (!isNaN(referrerId)) {
              await createReferral(referrerId, userId);
            }
          }

          // Получение информации о рефералах пользователя
          fetchUserReferrals(userId);
        }
      }
    };

    initApp();
  }, [initData, startParam]);

  const createReferral = async (referrerId: number, userId: number) => {
    await fetch(`${API_BASE_URL}/referrals/`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'User-agent': 'learning app',
      },
      body: JSON.stringify({
        user_tg_id: referrerId,
        friend_tg_id: userId,
      }),
    });

    // Обновление данных о рефералах после создания реферала
    fetchUserReferrals(userId);
  };

  
  const fetchUserReferrals = async (userId: number) => {
    console.log('Fetching referrals for user ID:', userId);
    try {
      const fetchOptions = {
        method: 'GET',
        mode: 'cors' as RequestMode,
        credentials: 'include' as RequestCredentials,
      };
  
      const referralsResponse = await fetch(`${API_BASE_URL}/referrals/${userId}`, fetchOptions);
      const pointsResponse = await fetch(`${API_BASE_URL}/referrals/${userId}/points`, fetchOptions);
  
      console.log('Referrals response status:', referralsResponse.status);
      console.log('Points response status:', pointsResponse.status);
  
      if (!referralsResponse.ok || !pointsResponse.ok) {
        throw new Error('One or more API requests failed');
      }
  
      const referralsData: Referral[] = await referralsResponse.json();
      const pointsData = await pointsResponse.json();
  
      console.log('Referrals Data:', referralsData);
      console.log('Points Data:', pointsData);
  
      if (!Array.isArray(referralsData) || typeof pointsData.total_points !== 'number') {
        throw new Error('Unexpected data format from API');
      }
  
      setReferrals(referralsData);
      setTotalPoints(pointsData.total_points);
    } catch (error) {
      console.error('Error fetching user referrals:', error);
      // Здесь вы можете добавить логику обработки ошибок, например, показать сообщение пользователю
    }
  };

  const handleInviteFriend = () => {
    const utils = initUtils(); // Использование Telegram utils для шеринга реферальной ссылки
    utils.shareURL(
      referralLink,
      'Join me on this awesome app!'
    );
  };

  return (
    <div className="referral-container">
      <div className="info-section">
        <p>Score 10% from buddies + 2.5% from their referrals.</p>
        <p>
          Get a <img className="ticket-discount" src={ticketDiscount} alt="Ticket discount" /> play pass for each fren.
        </p>
      </div>

      <div className="friends-section">
        <h3>{referrals.length} Frens</h3>
        <ul>
          {referrals.map((referral) => (
            <li key={referral.id} className="friend-item">
              <div className="friend-info">
                <div className="friend-avatar">
                  {referral.friend_tg_id.toString()[0].toUpperCase()}
                </div>
                <span>Friend ID: {referral.friend_tg_id}</span>
              </div>
              <span className="friend-points">{referral.points} BP</span>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleInviteFriend} className="invite-button">
        Invite a fren
      </button>

      <div className="total-points">
        <h3>Total Points: {totalPoints}</h3>
      </div>

      <FooterMenu />
    </div>
  );
};

export default ReferralSystem;
