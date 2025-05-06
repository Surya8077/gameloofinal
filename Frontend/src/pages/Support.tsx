import React, { useState } from 'react';
import '@styles/Support.scss';

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock FAQ data
  const faqs = [
    {
      id: 1,
      question: 'How do I download my purchased games?',
      answer: 'After purchasing a game, you can download it from your profile page under the "My Games" tab. Click on the game and select "Download" to start the installation process.'
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various regional payment methods. For a complete list, please visit our payment information page.'
    },
    {
      id: 3,
      question: 'Can I get a refund for a game?',
      answer: 'Yes, we offer refunds for games within 14 days of purchase if you have played less than 2 hours. To request a refund, go to your profile, select the game, and click on "Request Refund".'
    },
    {
      id: 4,
      question: 'How do I update my account information?',
      answer: 'You can update your account information by going to your profile page and clicking on the "Settings" tab. From there, you can modify your personal details, payment methods, and preferences.'
    },
    {
      id: 5,
      question: 'What should I do if a game is not working?',
      answer: 'If you\'re experiencing issues with a game, first try verifying the game files through the game launcher. If the problem persists, check our troubleshooting guides or contact our support team with specific details about the error.'
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="support-page">
      <div className="support-header">
        <h1>Support Center</h1>
        <p>Find help with your gaming experience</p>
      </div>

      <div className="support-content">
        <div className="support-tabs">
          <button 
            className={activeTab === 'faq' ? 'active' : ''} 
            onClick={() => setActiveTab('faq')}
          >
            FAQ
          </button>
          <button 
            className={activeTab === 'tickets' ? 'active' : ''} 
            onClick={() => setActiveTab('tickets')}
          >
            My Tickets
          </button>
          <button 
            className={activeTab === 'guides' ? 'active' : ''} 
            onClick={() => setActiveTab('guides')}
          >
            Guides
          </button>
        </div>

        <div className="support-tab-content">
          {activeTab === 'faq' && (
            <div className="faq-section">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-button">Search</button>
              </div>

              <div className="faq-list">
                {filteredFaqs.map(faq => (
                  <div key={faq.id} className="faq-item">
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>

              <div className="contact-support">
                <h3>Still need help?</h3>
                <p>Our support team is available 24/7 to assist you with any issues.</p>
                <button className="contact-button">Contact Support</button>
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="tickets-section">
              <h2>Support Tickets</h2>
              <p>You don't have any open support tickets.</p>
              <button className="new-ticket-button">Create New Ticket</button>
            </div>
          )}

          {activeTab === 'guides' && (
            <div className="guides-section">
              <h2>Help Guides</h2>
              <div className="guides-grid">
                <div className="guide-card">
                  <h3>Getting Started</h3>
                  <p>Learn the basics of our gaming platform</p>
                  <button className="read-guide-button">Read Guide</button>
                </div>
                <div className="guide-card">
                  <h3>Account Security</h3>
                  <p>Tips to keep your account safe</p>
                  <button className="read-guide-button">Read Guide</button>
                </div>
                <div className="guide-card">
                  <h3>Game Installation</h3>
                  <p>How to install and update your games</p>
                  <button className="read-guide-button">Read Guide</button>
                </div>
                <div className="guide-card">
                  <h3>Payment & Billing</h3>
                  <p>Understanding your purchases and refunds</p>
                  <button className="read-guide-button">Read Guide</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support; 