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

const API_BASE_URL = 'https://violet-coins-feel.loca.lt'; // Replace with your actual backend URL

const ReferralSystem: React.FC = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [referralLink, setReferralLink] = useState('');

  const initData = useInitData();
  const { startParam } = useLaunchParams();

  // Helper function to make fetch requests with ngrok bypass header and CORS handling
  const fetchWithNgrokBypass = async (url: string, options: RequestInit = {}) => {
    const defaultHeaders = {
      'ngrok-skip-browser-warning': '69420',
      'bypass-tunnel-reminder' : '12314',
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  };

  useEffect(() => {
    const initApp = async () => {
      if (initData?.user) {
        const userId = initData.user.id;

        if (userId) {
          // Создание реферальной ссылки
          const botUsername = "@tesase_bot";
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
    try {
      await fetchWithNgrokBypass(`${API_BASE_URL}/referrals/`, {
        method: 'POST',
        body: JSON.stringify({
          user_tg_id: referrerId,
          friend_tg_id: userId,
        }),
      });

      // Обновление данных о рефералах после создания реферала
      fetchUserReferrals(userId);
    } catch (error) {
      console.error('Error creating referral:', error);
    }
  };

  const fetchUserReferrals = async (userId: number) => {
    try {
      console.log('Fetching referrals for user ID:', userId);
      const referralsResponse = await fetchWithNgrokBypass(`${API_BASE_URL}/referrals/${userId}`);
      const pointsResponse = await fetchWithNgrokBypass(`${API_BASE_URL}/referrals/${userId}/points`);

      console.log('Referrals response:', referralsResponse);
      console.log('Points response:', pointsResponse);

      const referralsData: Referral[] = await referralsResponse.json();
      const { total_points } = await pointsResponse.json();

      console.log('Referrals Data:', referralsData);
      console.log('Total Points:', total_points);

      setReferrals(referralsData);
      setTotalPoints(total_points);
    } catch (error) {
      console.error('Error fetching user referrals:', error);
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