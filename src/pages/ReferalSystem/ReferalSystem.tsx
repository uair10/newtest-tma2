import React, { useState, useEffect } from 'react';
import { useInitData, useLaunchParams, type User } from '@telegram-apps/sdk-react';
import { initUtils } from '@telegram-apps/sdk';
import ticketDiscount from "./ticket-discount.png";
import './ReferalSystem.css';
import FooterMenu from '../FooterMenu/FooterMenu';

interface Referral {
  user_tg_id: number;
  friend_tg_id: number;
  points: number;
}

interface ReferralResponse {
  referrals: Referral[];
  total_points: number;
}

const API_BASE_URL = 'https://8d41-38-180-23-221.ngrok-free.app';

const ReferralSystem: React.FC = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [referralLink, setReferralLink] = useState('');

  const initData = useInitData();
  const { startParam } = useLaunchParams();

  useEffect(() => {
    const initApp = async () => {
      if (initData && initData.user) {
        const userId = initData.user.id;
        const botUsername = "tma123_bot"; // Replace with your bot's username
        const newReferralLink = `https://t.me/${botUsername}?startapp=kentId${userId}`;
        setReferralLink(newReferralLink);

        // Check if there's a referrer
        if (startParam && startParam.startsWith('kentId')) {
          const referrerId = parseInt(startParam.slice(6), 10);
          if (!isNaN(referrerId)) {
            await createReferral(initData.user, referrerId);
          }
        }

        fetchUserReferrals(userId);
      }
    };

    initApp();
  }, [initData, startParam]);

  const createReferral = async (user: User, referrerId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/referrals/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_tg_id: user.id, 
          friend_tg_id: referrerId
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create referral');
      }
      const result = await response.json();
      console.log('Referral created:', result);
      // Refresh user referrals after creating a new one
      fetchUserReferrals(user.id);
    } catch (error) {
      console.error('Error creating referral:', error);
    }
  };

  const fetchUserReferrals = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/referrals`);
      if (!response.ok) {
        throw new Error('Failed to fetch user referrals');
      }
      const data: ReferralResponse = await response.json();
      setReferrals(data.referrals);
      setTotalPoints(data.total_points);
    } catch (error) {
      console.error('Error fetching user referrals:', error);
    }
  };

  const handleInviteFriend = () => {
    const utils = initUtils();
    utils.shareURL(
      referralLink,
      '420!'
    );
  };

  return (
    <div className="referral-container">
      <div className="info-section">
        <p>Score 10% from buddies + 2.5% from their referrals.</p>
        <p>
          Get a <img className="ticket-discount" src={ticketDiscount} alt="Ticket discount"/> play pass for each fren.
        </p>
      </div>

      <div className="friends-section">
        <h3>{referrals.length} Frens</h3>
        <ul>
          {referrals.map((referral, index) => (
            <li key={index} className="friend-item">
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

      <button
        onClick={handleInviteFriend}
        className="invite-button"
      >
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