import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Default SVG Logo Data URL for NewsPilot AI
const DEFAULT_BRAND_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none"><circle cx="80" cy="80" r="70" stroke="white" stroke-width="12"/><path d="M50 110V50C50 50 85 50 85 75C85 100 50 100 50 100" stroke="white" stroke-width="14" stroke-linecap="round"/><text x="25" y="150" font-family="Outfit, sans-serif" font-weight="900" font-size="22" fill="white">NEWSPILOT</text></svg>`;

export const AppProvider = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState('generate'); // Default to AI Generator

  // Brand Kit State (persisted in LocalStorage)
  const [brandKit, setBrandKit] = useState(() => {
    const saved = localStorage.getItem('newspilot_brandkit');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      logo: DEFAULT_BRAND_LOGO,
      brandName: 'NewsPilot AI',
      logoPosition: 'top-left', // top-left, top-right, bottom-left, bottom-right
      logoSize: 80, // px height
      accentColor: '#ffc800', // Vibrant Yellow Box Highlight
      fontFamily: 'Outfit',
      socialIcons: {
        facebook: true,
        instagram: true,
        twitter: true,
        linkedin: true,
        youtube: false,
        website: true
      }
    };
  });

  // Save brand kit on changes
  useEffect(() => {
    localStorage.setItem('newspilot_brandkit', JSON.stringify(brandKit));
  }, [brandKit]);

  // User Workspace State
  const [user, setUser] = useState({
    name: 'Ali Computers',
    email: 'ali@newspilot.ai',
    workspace: 'My Workspace',
    plan: 'Pro Plan ($99/mo)',
    credits: 100,
    totalGenerated: 0,
    isLoggedIn: true
  });

  // Gemini API Key
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('newspilot_gemini_key') || '';
  });

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('newspilot_gemini_key', key);
  };

  // History State (Starts 100% clean with 0 demo items!)
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('newspilot_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('newspilot_history', JSON.stringify(history));
  }, [history]);

  // Current Working Poster (Default Manual Studio starts with 100% white text!)
  const [currentPoster, setCurrentPoster] = useState({
    headline: 'Over 2,000 BYD NEVs Reach Pakistan, Marking the Brand\'s Largest Shipment Yet',
    summary: 'BYD expands electric vehicle presence with a massive delivery of over 2,000 New Energy Vehicles.',
    highlightWords: '', // Empty by default -> 100% simple white text!
    category: 'MOBILITY & EV',
    company: 'BYD Auto',
    country: 'Pakistan 🇵🇰',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    keyNumber: 'Over 2,000 NEVs',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop',
    templateId: 'manual',
    isManualMode: true,
    platformRatio: '4:5',
    language: 'English',
    tone: 'Standard',
    captions: {
      instagram: '⚡ BREAKING: Over 2,000 BYD NEVs have arrived!\n\n#NewsPilot #EV #Mobility #TechNews',
      linkedin: 'BYD marks a major expansion milestone with the delivery of over 2,000 New Energy Vehicles.',
      twitter: '⚡ Over 2,000 BYD NEVs arrive in largest shipment yet! 🚗 #EV #NewsPilot',
      facebook: 'Electric Mobility Milestone: BYD delivers over 2,000 NEVs.'
    }
  });

  // Add new poster to history
  const addPosterToHistory = (posterData) => {
    const newEntry = {
      id: 'post-' + Date.now(),
      createdAt: new Date().toISOString(),
      favorite: false,
      ...posterData
    };
    setHistory(prev => [newEntry, ...prev]);
    setUser(prev => ({
      ...prev,
      credits: Math.max(0, prev.credits - 1),
      totalGenerated: prev.totalGenerated + 1
    }));
    return newEntry;
  };

  // Delete poster
  const deletePoster = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // Toggle Favorite
  const toggleFavorite = (id) => {
    setHistory(prev => prev.map(item => item.id === id ? { ...item, favorite: !item.favorite } : item));
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      brandKit,
      setBrandKit,
      user,
      setUser,
      apiKey,
      saveApiKey,
      history,
      addPosterToHistory,
      deletePoster,
      toggleFavorite,
      currentPoster,
      setCurrentPoster
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
