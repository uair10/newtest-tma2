import React, { useState, useEffect, useCallback } from 'react';
import ticketDiscount from "./ticket-discount.png";
import './ReferalSystem.css';
import FooterMenu from '../FooterMenu/FooterMenu';
import { initUtils, initInitData } from '@telegram-apps/sdk';

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
  
  const initDataUnsafe = initInitData();

  const handleReferral = useCallback((referrerId: string) => {
    setReferrals(prev => {
      if (!prev.includes(referrerId)) {
        return [...prev, referrerId];
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const botUsername = "tma123_bot"; // Replace with your bot's name
    
    if (initDataUnsafe && initDataUnsafe.user?.id) {
      const userId = initDataUnsafe.user.id;
      const newReferralLink = `https://t.me/${botUsername}?startapp=kentId${userId}`;
      setReferralLink(newReferralLink);
    } else {
      console.error('User ID not found');
    }

    if (initDataUnsafe && initDataUnsafe.startParam) {
      const startParam = initDataUnsafe.startParam;
      if (startParam.startsWith('kentId')) {
        const referrerId = startParam.slice(6);
        handleReferral(referrerId);
      }
    }

    fetchFriends();
  }, [initDataUnsafe, handleReferral]);

  const fetchFriends = async () => {
    // Replace with actual API call
    const mockFriends: Friend[] = [
      { id: '1', name: 'OyVeyLaVey', points: 89923 },
      { id: '2', name: 'sonicx123', points: 89923 },
      { id: '3', name: 'OyVeyLaVey', points: 89923 },
      { id: '4', name: 'sonicx123', points: 89923 },
      { id: '1', name: 'OyVeyLaVey', points: 89923 },
      { id: '2', name: 'sonicx123', points: 89923 },
      { id: '3', name: 'OyVeyLaVey', points: 89923 },
      { id: '4', name: 'sonicx123', points: 89923 },
    ];
    setFriends(mockFriends);
  };

  const handleInviteFriend = () => {
    const utils = initUtils();
    utils.shareURL(
      referralLink,
      '420!'
    );
  };

  useEffect(() => {
    const total = friends.reduce((sum, friend) => sum + friend.points, 0);
    setTotalPoints(total);
  }, [friends]);

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
      
      <div className="referrals-section">
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
      <FooterMenu />
    </div>
  );
};

export default ReferralSystem;