import React, { useState, useEffect } from 'react';
import ticketDiscount from "./ticket-discount.png";
import './ReferalSystem.css';
import FooterMenu from '../FooterMenu/FooterMenu';
import { initUtils, initInitData } from '@telegram-apps/sdk';

interface Friend {
  id: number;
  name: string;
  points: number;
}

const API_BASE_URL = 'https://61c9-38-180-23-221.ngrok-free.app';  // Replace with your actual API base URL

const ReferralSystem: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    const initApp = async () => {
      const initDataUnsafe = initInitData();
      if (initDataUnsafe && initDataUnsafe.user?.id) {
        const userId = initDataUnsafe.user.id;
        const botUsername = "tma123_bot"; // Replace with your bot's username
        const newReferralLink = `https://t.me/${botUsername}?startapp=kentId${userId}`;
        setReferralLink(newReferralLink);

        // Check if there's a referrer
        if (initDataUnsafe.startParam && initDataUnsafe.startParam.startsWith('kentId')) {
          const referrerId = parseInt(initDataUnsafe.startParam.slice(6), 10);
          if (!isNaN(referrerId)) {
            await createReferral(userId, referrerId);
          }
        }

        fetchUserData(userId);
      }
    };

    initApp();
  }, []);

  const createReferral = async (userId: number, referrerId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/referrals/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_tg_id: userId, friend_tg_id: referrerId }),
      });
      if (!response.ok) {
        throw new Error('Failed to create referral');
      }
    } catch (error) {
      console.error('Error creating referral:', error);
    }
  };

  const fetchUserData = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/referrals`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setFriends(data.referrals.map((referral: any) => ({
        id: referral.tg_id,
        name: referral.username,
        points: referral.points
      })));
      setTotalPoints(data.referrer.points);
    } catch (error) {
      console.error('Error fetching user data:', error);
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

      <div className="total-points">
        <h3>Total Points: {totalPoints}</h3>
      </div>
      <FooterMenu />
    </div>
  );
};

export default ReferralSystem;