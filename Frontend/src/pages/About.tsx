import React from 'react';
import '@styles/About.scss';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Our Gaming Platform</h1>
          <p>Your ultimate destination for gaming excellence</p>
        </div>
      </section>

      <section className="about-content">
        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2023, our gaming platform was born from a passion for bringing the best gaming experiences to players worldwide. 
            We started with a simple mission: to create a seamless, user-friendly platform where gamers could discover, purchase, and enjoy 
            the latest titles without hassle.
          </p>
          <p>
            Today, we've grown into a comprehensive gaming ecosystem, offering not just games, but a community where players can connect, 
            share experiences, and participate in tournaments. Our platform features the latest releases from top developers and publishers, 
            ensuring you always have access to the most exciting gaming content.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to enhance the gaming experience for everyone. We believe that gaming should be accessible, enjoyable, and 
            community-driven. By providing a platform that combines convenience, security, and social features, we aim to be the go-to 
            destination for gamers of all types.
          </p>
          <div className="mission-values">
            <div className="value-item">
              <h3>Quality</h3>
              <p>We curate only the best games, ensuring high-quality experiences for our users.</p>
            </div>
            <div className="value-item">
              <h3>Community</h3>
              <p>We foster a vibrant gaming community where players can connect and share their passion.</p>
            </div>
            <div className="value-item">
              <h3>Innovation</h3>
              <p>We continuously improve our platform with new features and technologies.</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Our Team</h2>
          <p>
            Our team consists of passionate gamers, developers, and industry experts who are dedicated to creating the best gaming platform. 
            With diverse backgrounds and shared enthusiasm for gaming, we work together to bring you an exceptional experience.
          </p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="/assets/team-1.jpg" alt="Team Member" />
              </div>
              <h3>John Doe</h3>
              <p>Founder & CEO</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="/assets/team-2.jpg" alt="Team Member" />
              </div>
              <h3>Jane Smith</h3>
              <p>Head of Product</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="/assets/team-3.jpg" alt="Team Member" />
              </div>
              <h3>Mike Johnson</h3>
              <p>Community Manager</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 