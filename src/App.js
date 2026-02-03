import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient(
  'https://kjcqqbjsdglzvquakyze.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqY3FxYmpzZGdsenZxdWFreXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjQ0NTksImV4cCI6MjA4NTcwMDQ1OX0.XDOJ4WNw3a6efWgJjjgTddSqceSuRG_3hcU4PNLN46M'
);

const FloatingHearts = () => {
  const hearts = ['♡', '♥', '💕', '🌸', '✨'];
  
  return (
    <div className="floating-hearts">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="heart"
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ 
            y: '-100vh', 
            opacity: [0, 0.6, 0],
            x: Math.sin(i) * 80
          }}
          transition={{
            duration: Math.random() * 12 + 12,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: 'linear'
          }}
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 8 + 14}px`
          }}
        >
          {hearts[Math.floor(Math.random() * hearts.length)]}
        </motion.div>
      ))}
    </div>
  );
};

const Confetti = () => {
  const colors = ['#ff6b9d', '#f7b2bd', '#ffd93d', '#6bcf7f', '#a8e6cf'];
  
  return (
    <div className="confetti-container">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          className="confetti"
          initial={{ y: -10, opacity: 1 }}
          animate={{ 
            y: window.innerHeight + 10,
            x: Math.random() * 200 - 100,
            rotate: 360
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
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
      alert('What should I call you? 😊');
      return;
    }
    setUserData(prev => ({ ...prev, timestamp: new Date().toISOString() }));
    setStep('story');
  };

  const handleResponse = (response) => {
    setUserData(prev => ({ ...prev, response }));
    if (response === 'yes') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
    setStep('feelings');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.message.trim()) {
      alert('I\'d love to hear your thoughts 💭');
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="step-container"
          >
            <div className="card">
              <motion.h1
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                Hey there 🌸
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                I made something special, just for you
              </motion.p>
              
              <form onSubmit={handleWelcomeSubmit} className="form">
                <motion.input
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  type="text"
                  placeholder="Your name"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  className="input"
                />
                <motion.input
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  type="email"
                  placeholder="Email (optional)"
                  value={userData.email}
                  onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                  className="input"
                />
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="button primary"
                >
                  Continue ✨
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'story' && (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="step-container"
          >
            <div className="card story-card">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Hi {userData.name}, you know how some people just... fit perfectly? 🌸
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="story-text"
              >
                There's this feeling when someone walks into your world and suddenly everything feels... warmer. 
                Like when you're having the most ordinary day, but then you see their smile and somehow it becomes extraordinary.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="story-text"
              >
                I've been thinking about how some conversations just flow naturally, how some laughs feel like home, 
                and how some people make you want to be the best version of yourself without even trying.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="proposal-text"
              >
                What I'm trying to say is... you're that person for me. 
                And I was wondering if maybe, just maybe, you'd like to explore what this could be? ✨
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 }}
                className="button-container"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleResponse('yes')}
                  className="button yes-button"
                >
                  🌸 I'd love to see where this goes
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleResponse('no')}
                  className="button no-button"
                >
                  🤍 I treasure what we have as friends
                </motion.button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7 }}
                className="closing-text"
              >
                Whatever you're feeling is perfectly okay 🤍
              </motion.p>
            </div>
          </motion.div>
        )}

        {step === 'feelings' && (
          <motion.div
            key="feelings"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="step-container"
          >
            <div className="card">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {userData.response === 'yes' 
                  ? "Really? 🥰 My heart is so full right now!" 
                  : "Thank you for being so honest with me 🌿"}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {userData.response === 'yes'
                  ? "There's no rush at all. We can take this one beautiful moment at a time."
                  : "Your friendship is such a gift to me. I'm grateful for the honesty and trust between us."}
              </motion.p>

              <form onSubmit={handleSubmit} className="form">
                <motion.textarea
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  placeholder="What's in your heart right now?"
                  value={userData.message}
                  onChange={(e) => setUserData(prev => ({ ...prev, message: e.target.value }))}
                  className="textarea"
                  rows="3"
                />
                
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="button primary"
                >
                  Send 💕
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'thankyou' && (
          <motion.div
            key="thankyou"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="step-container"
          >
            <div className="card">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Thank you 🌸
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Thank you for sharing this moment with me. It means more than words can say.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;