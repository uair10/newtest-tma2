import React from 'react';
import './MainApp1.css';
import clockImage from './clock.png';
import plantImage from './plant.png';
import FooterMenu from '../FooterMenu/FooterMenu';
import logo from './Logo.svg';
import flowerImage from './flower.png';
import concentratesImage from './concentrates.png';
import ediblesImage from './edibles.png';
import accessoriesImage from './accessories.png';
// Import images for best sellers and brands
import peachesAndCreamImage from './peaches-and-cream.png';
import sourGrapeGummyImage from './sour-grape-gummy.png';
import paxHighPurityImage from './pax-high-purity.png';
import rawGardenLogo from './raw-garden-logo.png';
import stiiizyLogo from './stiiizy-logo.png';
import kivaLogo from './kiva-logo.png';
import humboldtFarmsLogo from './humboldt-farms-logo.png';

const MainApp1: React.FC = () => {
  return (
    <div className="container">
      <header className="header">
        <div className="logo">
            <img src={logo} alt='logo' />
        </div>
      </header>
      
      <div className="features">
        <div className="feature">
          <img src={clockImage} alt="Clock" />
          <h2>ON-DEMAND DELIVERY</h2>
          <p>Shop on Eaze and get your weed delivered on demand, wherever you are.</p>
        </div>
        <div className="feature">
          <img src={plantImage} alt="Plant" />
          <h2>DANK SELECTION</h2>
          <p>We calculated the best selection for any experience or price range.</p>
        </div>
      </div>
      <div className="button-container">
      <a href="#" className="shop-button">Shop Now</a>
      </div>
      <div className="products-section">
        <h1>PRODUCTS YOU LOVE</h1>
        <p>Shop our highly curated selection of the best brands, for the best value</p>
        <div className="product-grid">
          <div className="product-item">
            <img src={flowerImage} alt="Flower" />
            <h3>FLOWER</h3>
          </div>
          <div className="product-item">
            <img src={concentratesImage} alt="Concentrates" />
            <h3>CONCENTRATES</h3>
          </div>
          <div className="product-item">
            <img src={ediblesImage} alt="Edibles" />
            <h3>EDIBLES</h3>
          </div>
          <div className="product-item">
            <img src={accessoriesImage} alt="Accessories" />
            <h3>ACCESSORIES</h3>
          </div>
        </div>
      </div>

      <div className="button-container">
      <a href="#" className="shop-button">Shop Now</a>
      </div>
      <div className="best-sellers-section">
        <h1>BEST SELLERS</h1>
        <div className="best-sellers-grid">
          <div className="best-seller-item">
            <img src={peachesAndCreamImage} alt="Peaches and Cream" />
            <h3>Peaches and Cream - 1g</h3>
            <p>Kiva</p>
          </div>
          <div className="best-seller-item">
            <img src={sourGrapeGummyImage} alt="Sour Grape Gummy" />
            <h3>Sour Grape Gummy Single</h3>
            <p>Froot</p>
          </div>
          <div className="best-seller-item">
            <img src={sourGrapeGummyImage} alt="Sour Grape Gummy" />
            <h3>Sour Grape Gummy Single</h3>
            <p>Froot</p>
          </div>
          <div className="best-seller-item">
            <img src={paxHighPurityImage} alt="Pax High Purity" />
            <h3>Pax High Purity: Limoncello Haze</h3>
            <p>PAX</p>
          </div>
          <div className="best-seller-item">
            <img src={peachesAndCreamImage} alt="Peaches and Cream" />
            <h3>Peaches and Cream - 1g</h3>
            <p>Kiva</p>
          </div>
          <div className="best-seller-item">
            <img src={peachesAndCreamImage} alt="Peaches and Cream" />
            <h3>Peaches and Cream - 1g</h3>
            <p>Kiva</p>
          </div>
        </div>
        <div className="see-more-container">
        <a href="#" className="see-more-link">See More →</a>
        </div>
      </div>
      
      <div className="brands-section">
        <h1>BRANDS WE CARRY</h1>
        <div className="brands-grid">
          <div className="brand-item">
            <img src={rawGardenLogo} alt="Raw Garden" className="brand-logo" />
          </div>
          <div className="brand-item">
            <img src={stiiizyLogo} alt="Stiiizy" className="brand-logo" />
          </div>
          <div className="brand-item">
            <img src={kivaLogo} alt="Kiva" className="brand-logo" />
          </div>
          <div className="brand-item">
            <img src={humboldtFarmsLogo} alt="Humboldt Farms" className="brand-logo" />
          </div>
        </div>
      </div>
      <div>
        <FooterMenu />
      </div>
    </div>
  );
};

export default MainApp1;