import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@styles/Products.scss';

const Products: React.FC = () => {
  const [filter, setFilter] = useState('all');
  
  const games = [
    {
      id: 1,
      title: 'God of War Ragnarök',
      image: '/assets/god-of-war.jpg',
      price: '$59.99',
      category: 'action',
      rating: 4.9,
    },
    {
      id: 2,
      title: 'The Last of Us Part II',
      image: '/assets/last-of-us.jpg',
      price: '$49.99',
      category: 'action',
      rating: 4.8,
    },
    {
      id: 3,
      title: 'Spider-Man 2',
      image: '/assets/spider-man.jpg',
      price: '$69.99',
      category: 'action',
      rating: 4.7,
    },
    {
      id: 4,
      title: 'Hogwarts Legacy',
      image: '/assets/hogwarts.jpg',
      price: '$59.99',
      category: 'rpg',
      rating: 4.6,
    },
    {
      id: 5,
      title: 'Final Fantasy XVI',
      image: '/assets/ff16.jpg',
      price: '$69.99',
      category: 'rpg',
      rating: 4.5,
    },
    {
      id: 6,
      title: 'Mortal Kombat 1',
      image: '/assets/mk1.jpg',
      price: '$59.99',
      category: 'fighting',
      rating: 4.4,
    },
    {
      id: 7,
      title: 'Tekken 8',
      image: '/assets/tekken8.jpg',
      price: '$59.99',
      category: 'fighting',
      rating: 4.3,
    },
    {
      id: 8,
      title: 'Forza Horizon 5',
      image: '/assets/forza.jpg',
      price: '$49.99',
      category: 'racing',
      rating: 4.8,
    },
    {
      id: 9,
      title: 'FIFA 23',
      image: '/assets/fifa.jpg',
      price: '$59.99',
      category: 'sports',
      rating: 4.2,
    },
  ];

  const filteredGames = filter === 'all' 
    ? games 
    : games.filter(game => game.category === filter);

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Games</h1>
        <div className="filter-controls">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'action' ? 'active' : ''} 
            onClick={() => setFilter('action')}
          >
            Action
          </button>
          <button 
            className={filter === 'rpg' ? 'active' : ''} 
            onClick={() => setFilter('rpg')}
          >
            RPG
          </button>
          <button 
            className={filter === 'fighting' ? 'active' : ''} 
            onClick={() => setFilter('fighting')}
          >
            Fighting
          </button>
          <button 
            className={filter === 'racing' ? 'active' : ''} 
            onClick={() => setFilter('racing')}
          >
            Racing
          </button>
          <button 
            className={filter === 'sports' ? 'active' : ''} 
            onClick={() => setFilter('sports')}
          >
            Sports
          </button>
        </div>
      </div>

      <div className="products-grid">
        {filteredGames.map((game) => (
          <div key={game.id} className="product-card">
            <div className="product-image">
              <img src={game.image} alt={game.title} />
              <div className="product-rating">
                <span>★</span> {game.rating}
              </div>
            </div>
            <div className="product-info">
              <h3>{game.title}</h3>
              <p className="product-price">{game.price}</p>
              <div className="product-actions">
                <Link to={`/products/${game.id}`} className="button secondary">
                  Details
                </Link>
                <Link to={`/pay-${game.title.toLowerCase().replace(/\s+/g, '-')}`} className="button">
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products; 