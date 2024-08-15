import React, { useState, useEffect } from 'react';
import { useInitData, useLaunchParams } from '@telegram-apps/sdk-react';
import { initUtils } from '@telegram-apps/sdk';
import ticketDiscount from "./ticket-discount.png";
import './ReferalSystem.css';
import FooterMenu from '../FooterMenu/FooterMenu';

interface Referral {
  id: number;
  date: string;
  user_tg_id: number;
  friend_tg_id: number;
  points: number;
}

const API_BASE_URL = 'https://ffaa-38-180-23-221.ngrok-free.app'; // Replace with your actual backend URL

const ReferralSystem: React.FC = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [referralLink, setReferralLink] = useState('');
  const [error, setError] = useState<string | null>(null);

  const initData = useInitData();
  const { startParam } = useLaunchParams();

  useEffect(() => {
    const initApp = async () => {
      if (initData && initData.user) {
        const userId = initData.user.id;
        const botUsername = "tma123_bot"; // Replace with your bot's username
        const newReferralLink = `https://t.me/${botUsername}?startapp=${userId}`;
        setReferralLink(newReferralLink);

        // Check if there's a referrer
        if (startParam) {
          const referrerId = parseInt(startParam, 10);
          if (!isNaN(referrerId)) {
            await createReferral(referrerId, userId);
          }
        }

        fetchUserReferrals(userId);
      }
    };

    initApp();
  }, [initData, startParam]);

  const createReferral = async (referrerId: number, userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/referrals/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_tg_id: referrerId, 
          friend_tg_id: userId
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create referral');
      }
      await fetchUserReferrals(userId);
    } catch (error) {
      console.error('Error creating referral:', error);
      setError('Failed to create referral. Please try again.');
    }
  };

  const fetchUserReferrals = async (userId: number) => {
    try {
      const referralsResponse = await fetch(`${API_BASE_URL}/referrals/${userId}`);
      const pointsResponse = await fetch(`${API_BASE_URL}/referrals/${userId}/points`);
      if (!referralsResponse.ok || !pointsResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      const referralsData: Referral[] = await referralsResponse.json();
      const { total_points } = await pointsResponse.json();
      setReferrals(referralsData);
      setTotalPoints(total_points);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data. Please try again.');
    }
  };

  const handleInviteFriend = () => {
    const utils = initUtils();
    utils.shareURL(
      referralLink,
      'Join me on this awesome app!'
    );
  };

  return (
    <div className="referral-container">
      {error && <div className="error-message">{error}</div>}
      <div className="info-section">
        <p>Score 10% from buddies + 2.5% from their referrals.</p>
        <p>
          Get a <img className="ticket-discount" src={ticketDiscount} alt="Ticket discount"/> play pass for each fren.
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