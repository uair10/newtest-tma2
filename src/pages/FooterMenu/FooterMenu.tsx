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
    const path = location.pathname;
    if (path === '/' || path === '/shop') {
      setActivePath('/shop');
    } else if (path.startsWith('/task/')) {
      setActivePath('/clipboard');
    } else {
      setActivePath(path);
    }
  }, [location]);

  const isActive = (path: string) => {
    if (path === '/shop' && (activePath === '/' || activePath === '/shop')) {
      return true;
    }
    if (path === '/clipboard' && activePath.startsWith('/task/')) {
      return true;
    }
    return activePath === path;
  };

  return (
    <div className="footer-menu">
      {[
        { path: '/shop', image: shopImage, alt: 'Shop' },
        { path: '/clipboard', image: clipboardImage, alt: 'Clipboard' },
        { path: '/bag', image: bagImage, alt: 'Bag' },
        { path: '/profile', image: profileActiveImage, alt: 'Profile' },
        { path: '/info', image: infoImage, alt: 'Info' },
      ].map(({ path, image, alt }) => (
        <Link
          key={path}
          to={path}
          className={`footer-icon ${isActive(path) ? 'active' : ''}`}
        >
          <img src={image} alt={alt} />
        </Link>
      ))}
    </div>
  );
};

export default FooterMenu;