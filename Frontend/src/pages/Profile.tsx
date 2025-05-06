import React, { useState } from 'react';
import '@styles/Profile.scss';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('games');
  
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/assets/avatar.jpg',
    joinDate: 'January 2023',
    games: [
      { id: 1, title: 'God of War Ragnarök', purchaseDate: '2023-02-15', playtime: '45 hours' },
      { id: 2, title: 'The Last of Us Part II', purchaseDate: '2023-03-20', playtime: '32 hours' },
      { id: 3, title: 'Spider-Man 2', purchaseDate: '2023-04-10', playtime: '28 hours' },
    ],
    achievements: [
      { id: 1, title: 'First Purchase', date: '2023-02-15' },
      { id: 2, title: 'Game Collector', date: '2023-04-10' },
      { id: 3, title: 'Social Butterfly', date: '2023-05-01' },
    ],
    settings: {
      notifications: true,
      newsletter: true,
      twoFactorAuth: false,
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={user.avatar} alt={user.name} />
        </div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <p className="join-date">Member since {user.joinDate}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button 
            className={activeTab === 'games' ? 'active' : ''} 
            onClick={() => setActiveTab('games')}
          >
            My Games
          </button>
          <button 
            className={activeTab === 'achievements' ? 'active' : ''} 
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''} 
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        <div className="profile-tab-content">
          {activeTab === 'games' && (
            <div className="games-list">
              <h2>My Games</h2>
              {user.games.map(game => (
                <div key={game.id} className="game-item">
                  <div className="game-info">
                    <h3>{game.title}</h3>
                    <p>Purchased: {game.purchaseDate}</p>
                    <p>Playtime: {game.playtime}</p>
                  </div>
                  <button className="play-button">Play Now</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="achievements-list">
              <h2>Achievements</h2>
              {user.achievements.map(achievement => (
                <div key={achievement.id} className="achievement-item">
                  <div className="achievement-icon">🏆</div>
                  <div className="achievement-info">
                    <h3>{achievement.title}</h3>
                    <p>Earned: {achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-form">
              <h2>Account Settings</h2>
              <div className="setting-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={user.settings.notifications} 
                  />
                  Email Notifications
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={user.settings.newsletter} 
                  />
                  Newsletter Subscription
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input 
                    type="checkbox" 
                    checked={user.settings.twoFactorAuth} 
                  />
                  Two-Factor Authentication
                </label>
              </div>
              <button className="save-settings">Save Changes</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 