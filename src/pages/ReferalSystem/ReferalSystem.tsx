import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useInitData } from '@telegram-apps/sdk-react';
import ticketDiscount from "./ticket-discount.png";
import './ReferalSystem.css';
import FooterMenu from '../FooterMenu/FooterMenu';

interface Friend {
  tg_id: string;
  username: string;
  ref_link: string;
  points: number;
}

interface User {
  tg_id: string;
  username: string;
  ref_link: string;
  points: number;
}

// Расширение типа Window для включения Telegram WebApp
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        showPopup: (params: {
          title?: string;
          message: string;
          buttons: Array<{ type: string; text: string; data?: string }>;
        }) => void;
      };
    };
  }
}

const API_BASE_URL = 'https://c68a-38-180-23-221.ngrok-free.app';
const BOT_USERNAME = "tma123_bot";

axios.defaults.withCredentials = true;

const ReferralSystem: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<Friend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const initData = useInitData();

  const createOrGetUser = useCallback(async () => {
    if (!initData?.user?.id || !initData?.user?.username) {
      console.error('User ID or username not found in initData');
      setError('Failed to initialize Telegram Mini App data');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post<User>(`${API_BASE_URL}/users/`, {
        tg_id: initData.user.id.toString(),
        username: initData.user.username
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error creating or getting user:', error);
      setError('Failed to create or get user');
    } finally {
      setIsLoading(false);
    }
  }, [initData?.user?.id, initData?.user?.username]);

  const handleReferral = useCallback(async (referrerId: string) => {
    if (!initData?.user?.id) {
      setError('User ID not found');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/referrals/`, {
        user_tg_id: referrerId,
        friend_tg_id: initData.user.id.toString()
      });
      fetchReferrals();
      createOrGetUser();
    } catch (error) {
      console.error('Error creating referral:', error);
      setError('Failed to create referral');
    }
  }, [initData?.user?.id, createOrGetUser]);

  const fetchReferrals = async () => {
    if (!initData?.user?.id) {
      setError('User ID not found');
      return;
    }

    try {
      const response = await axios.get<Friend[]>(`${API_BASE_URL}/users/${initData.user.id}/friends`);
      setReferrals(response.data);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      setError('Failed to fetch referrals');
    }
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        if (!initData || !initData.user) {
          setError("Failed to initialize Telegram Mini App data");
          setIsLoading(false);
          return;
        }

        await createOrGetUser();

        if (initData.user.id) {
          const userId = initData.user.id.toString();
          const newReferralLink = `https://t.me/${BOT_USERNAME}?startapp=kentId${userId}`;

          await axios.post(`${API_BASE_URL}/users/${userId}/referral_link`, {
            ref_link: newReferralLink
          });
        }

        if (initData.startParam) {
          const startParam = initData.startParam;
          if (startParam.startsWith('kentId')) {
            const referrerId = startParam.slice(6);
            await handleReferral(referrerId);
          }
        }

        await fetchReferrals();
      } catch (error) {
        console.error('Error initializing app:', error);
        setError('Failed to initialize app');
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, [initData, handleReferral, createOrGetUser]);

  const handleInviteFriend = () => {
    if (user) {
      window.Telegram.WebApp.showPopup({
        title: "Invite a Friend",
        message: "Share this link with your friend:",
        buttons: [
          { type: "default", text: "Copy Link", data: user.ref_link },
          { type: "cancel", text: "Cancel" }
        ]
      });
    } else {
      setError('User data not available');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

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
          {referrals.map((friend) => (
            <li key={friend.tg_id} className="friend-item">
              <div className="friend-info">
                <div className="friend-avatar">
                  {friend.username[0].toUpperCase()}
                </div>
                <span>{friend.username}</span>
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

      <div className="user-points">
        <h3>Your Points: {user.points}</h3>
      </div>
      <FooterMenu />
    </div>
  );
};

export default ReferralSystem;