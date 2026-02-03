import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient(
  'https://kjcqqbjsdglzvquakyze.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqY3FxYmpzZGdsenZxdWFreXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjQ0NTksImV4cCI6MjA4NTcwMDQ1OX0.XDOJ4WNw3a6efWgJjjgTddSqceSuRG_3hcU4PNLN46M'
);

const FloatingHearts = () => {
  const hearts = ['♡', '♥', '💕', '🌸', '✨', '🦋', '🌺'];
  
  return (
    <div className="floating-hearts">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="heart"
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ 
            y: '-100vh', 
            opacity: [0, 1, 0],
            x: Math.sin(i) * 150
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: 'linear'
          }}
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 12 + 16}px`
          }}
        >
          {hearts[Math.floor(Math.random() * hearts.length)]}
        </motion.div>
      ))}
    </div>
  );
};

const Confetti = () => {
  const colors = ['#ff6b9d', '#f7b2bd', '#ffd93d', '#6bcf7f', '#a8e6cf', '#ffd3a5'];
  
  return (
    <div className="confetti-container">
      {[...Array(80)].map((_, i) => (
        <motion.div
          key={i}
          className="confetti"
          initial={{ y: -10, opacity: 1 }}
          animate={{ 
            y: window.innerHeight + 10,
            x: Math.random() * 300 - 150,
            rotate: 720
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            delay: Math.random() * 3,
            ease: 'easeOut'
          }}
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)]
          }}
        />
      ))}
    </div>
  );
};

function App() {
  const [step, setStep] = useState('welcome');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    response: '',
    message: '',
    timestamp: ''
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const handleWelcomeSubmit = (e) => {
    e.preventDefault();
    if (!userData.name.trim()) {
      alert('I would be delighted to know what I should call you 😊');
      return;
    }
    setUserData(prev => ({ ...prev, timestamp: new Date().toISOString() }));
    setStep('story');
  };

  const handleResponse = (response) => {
    setUserData(prev => ({ ...prev, response }));
    if (response === 'yes') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
    }
    setStep('feelings');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.message.trim()) {
      alert('I would truly appreciate hearing your thoughts 💭');
      return;
    }

    try {
      const { error } = await supabase
        .from('proposal_responses')
        .insert([userData]);
      
      if (error) {
        console.error('Supabase error:', error);
        localStorage.setItem('proposalData', JSON.stringify(userData));
      }
    } catch (err) {
      console.error('Error:', err);
      localStorage.setItem('proposalData', JSON.stringify(userData));
    }

    setStep('thankyou');
  };

  return (
    <div className="app">
      <FloatingHearts />
      {showConfetti && <Confetti />}
      
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="step-container"
          >
            <div className="card">
              <motion.h1
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              >
                Hello there, beautiful soul 🌸
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                I've created something special with you in mind. It would mean the world to me if this could feel personal and genuine.
              </motion.p>
              
              <form onSubmit={handleWelcomeSubmit} className="form">
                <motion.input
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  type="text"
                  placeholder="What would you like me to call you?"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  className="input"
                />
                <motion.input
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  type="email"
                  placeholder="Your email (only if you're comfortable sharing)"
                  value={userData.email}
                  onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                  className="input"
                />
                <motion.input
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  type="tel"
                  placeholder="Your phone (completely optional)"
                  value={userData.phone}
                  onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                  className="input"
                />
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(236, 72, 153, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="button primary"
                >
                  I'm curious to see what this is ✨
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'story' && (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="step-container"
          >
            <div className="card story-card">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Dear {userData.name}, have you ever noticed how some people just seem to make life feel... softer?
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="story-text"
              >
                I've been reflecting on how effortlessly you bring grace into everyday moments. 
                There's something truly special about your presence — the way you listen with such kindness, 
                how your smile seems to light up even the simplest conversations. 
                It's made me realize something I've been wanting to share with you.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="proposal-text"
              >
                I have developed genuine feelings for you. Not in any overwhelming or pressuring way, 
                but in the most sincere and respectful manner possible. 
                I would be honored to explore the possibility of something beautiful together, 
                if your heart feels the same way.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 }}
                className="button-container"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 15px 35px rgba(255, 107, 157, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleResponse('yes')}
                  className="button yes-button"
                >
                  🌸 I would love to explore this with you
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleResponse('no')}
                  className="button no-button"
                >
                  🌿 I treasure our friendship as it is
                </motion.button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="closing-text"
              >
                Whatever you're feeling is perfectly valid and respected. 
                Thank you for taking this moment to read something so close to my heart 🤍
              </motion.p>
            </div>
          </motion.div>
        )}

        {step === 'feelings' && (
          <motion.div
            key="feelings"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="step-container"
          >
            <div className="card">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {userData.response === 'yes' 
                  ? "Oh my goodness, truly? 🥰 This fills my heart with such joy!" 
                  : "Thank you for your honesty and grace 🌿"}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {userData.response === 'yes'
                  ? "Please know there's absolutely no pressure or expectations. We can take this journey at whatever pace feels comfortable and natural for both of us."
                  : "Your friendship means the absolute world to me, and I deeply respect and cherish the beautiful connection we already share."}
              </motion.p>

              <form onSubmit={handleSubmit} className="form">
                <motion.textarea
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  placeholder="I would be so grateful if you'd share whatever is in your heart right now..."
                  value={userData.message}
                  onChange={(e) => setUserData(prev => ({ ...prev, message: e.target.value }))}
                  className="textarea"
                  rows="4"
                />
                
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(236, 72, 153, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="button primary"
                >
                  Share with love and trust 💕
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'thankyou' && (
          <motion.div
            key="thankyou"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="step-container"
          >
            <div className="card">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Thank you from the depths of my heart 🌸
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your openness and honesty mean more to me than words can express. 
                Whatever path lies ahead, I am deeply grateful for this beautiful moment we've shared together.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ marginTop: '20px', fontSize: '0.95rem', fontStyle: 'italic' }}
              >
                With all my love and respect 💝
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;