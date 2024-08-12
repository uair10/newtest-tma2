import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ticketDiscount from "./ticket-discount.png";
import './ReferalSystem.css';
import FooterMenu from '../FooterMenu/FooterMenu';
import { initUtils, initInitData, InitData } from '@telegram-apps/sdk';

interface Friend {
  tg_id: string;
  username: string;
  points: number;
}

interface User {
  tg_id: string;
  username: string;
  ref_link: string;
  points: number;
}

const API_BASE_URL = 'http://localhost:8001';  // Обновите на реальный URL вашего API

const ReferralSystem: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [referralLink, setReferralLink] = useState('');
  const [referrals, setReferrals] = useState<string[]>([]);
  
  const initDataUnsafe: InitData | undefined = initInitData();

  const handleReferral = useCallback(async (referrerId: string) => {
    if (!initDataUnsafe?.user?.id) {
      console.error('User ID not found');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/referrals/`, {
        user_tg_id: referrerId,
        friend_tg_id: initDataUnsafe.user.id
      });
      setReferrals(prev => {
        if (!prev.includes(referrerId)) {
          return [...prev, referrerId];
        }
        return prev;
      });
      // Обновляем поинты пользователя после успешного реферала
      fetchUserPoints();
    } catch (error) {
      console.error('Error creating referral:', error);
    }
  }, [initDataUnsafe?.user?.id]);

  const fetchUserPoints = async () => {
    if (!initDataUnsafe?.user?.id) {
      console.error('User ID not found');
      return;
    }

    try {
      const response = await axios.get<{ points: number }>(`${API_BASE_URL}/users/${initDataUnsafe.user.id}/points`);
      setUserPoints(response.data.points);
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

  useEffect(() => {
    const createOrGetUser = async () => {
      if (initDataUnsafe?.user?.id && initDataUnsafe?.user?.username) {
        try {
          const response = await axios.post<User>(`${API_BASE_URL}/users/`, {
            tg_id: initDataUnsafe.user.id,
            username: initDataUnsafe.user.username
          });
          setReferralLink(response.data.ref_link);
          setUserPoints(response.data.points);
        } catch (error) {
          console.error('Error creating/getting user:', error);
        }
      } else {
        console.error('User ID or username not found');
      }
    };

    createOrGetUser();

    if (initDataUnsafe?.startParam) {
      const startParam = initDataUnsafe.startParam;
      if (startParam.startsWith('kentId')) {
        const referrerId = startParam.slice(6);
        handleReferral(referrerId);
      }
    }

    fetchFriends();
    fetchUserPoints();
  }, [initDataUnsafe, handleReferral]);

  const fetchFriends = async () => {
    if (!initDataUnsafe?.user?.id) {
      console.error('User ID not found');
      return;
    }

    try {
      const response = await axios.get<Friend[]>(`${API_BASE_URL}/users/${initDataUnsafe.user.id}/friends`);
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
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
        <p> 
          Score 10% from buddies + 2.5% from their referrals.
        </p>
        <p>
          Get a <img className="ticket-discount" src={ticketDiscount} alt="Ticket discount"/> play pass for each fren.
        </p>
      </div>
  
      <div className="friends-section">
        <h3>{friends.length} Frens</h3>
        <ul>
          {friends.map((friend) => (
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
      
      <div className="referrals-section">
        <h3>Invited frens: {referrals.length}</h3>
        <ul>
          {referrals.map((referralId, index) => (
            <li key={index}>Fren ID: {referralId}</li>
          ))}
        </ul>
      </div>

      <div className="user-points">
        <h3>Your Points: {userPoints}</h3>
      </div>
      <FooterMenu />
    </div>
  );
};

export default ReferralSystem;