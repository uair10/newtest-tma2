import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import shopImage from './shop.svg';
import clipboardImage from './clipboard.svg';
import bagImage from './bag.svg';
import profileActiveImage from './profile.svg';
import infoImage from './info.svg';
import './FooterMenu.css';

const FooterMenu: React.FC = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const handleLinkClick = (path: string) => {
    setActivePath(path);
  };

  return (
    <div className="footer-menu">
      {[
        { path: '/shop', image: shopImage, alt: 'Shop' },
        { path: '/clipboard', image: clipboardImage, alt: 'Clipboard' },
        { path: '/bag', image: bagImage, alt: 'Bag' },
        { path: '/profile', image: profileActiveImage, alt: 'Profile' },
        { path: '/main-app-6', image: infoImage, alt: 'Info' },
      ].map(({ path, image, alt }) => (
        <Link
          key={path}
          to={path}
          className={`footer-icon ${activePath === path ? 'active' : ''}`}
          onClick={() => handleLinkClick(path)}
        >
          <img src={image} alt={alt} />
        </Link>
      ))}
    </div>
  );
};

export default FooterMenu;