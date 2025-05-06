import React from 'react';
import { Link } from 'react-router-dom';
import '@styles/Home.scss';

const Home: React.FC = () => {
  const featuredGames = [
    {
      id: 1,
      title: 'God of War Ragnarök',
      image: '/assets/god-of-war.jpg',
      price: '$59.99',
    },
    {
      id: 2,
      title: 'The Last of Us Part II',
      image: '/assets/last-of-us.jpg',
      price: '$49.99',
    },
    {
      id: 3,
      title: 'Spider-Man 2',
      image: '/assets/spider-man.jpg',
      price: '$69.99',
    },
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to the Ultimate Gaming Experience</h1>
          <p>Discover the latest and greatest games, connect with fellow gamers, and join our vibrant community.</p>
          <Link to="/products" className="button">Explore Games</Link>
        </div>
      </section>

      <section className="featured-games">
        <h2>Featured Games</h2>
        <div className="games-grid">
          {featuredGames.map((game) => (
            <div key={game.id} className="game-card">
              <img src={game.image} alt={game.title} />
              <h3>{game.title}</h3>
              <p className="price">{game.price}</p>
              <Link to={`/products/${game.id}`} className="button secondary">
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Join Our Gaming Community</h2>
        <p>Create an account to access exclusive deals, participate in tournaments, and connect with other gamers.</p>
        <Link to="/login" className="button">Sign Up Now</Link>
      </section>
    </div>
  );
};

export default Home; 