import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import OverviewTab from './components/dashboard/OverviewTab';
import CanvasStudio from './components/editor/CanvasStudio';
import HistoryTab from './components/history/HistoryTab';
import BrandKitTab from './components/brand/BrandKitTab';

function MainLayout() {
  const { activeTab } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'studio':
        return <CanvasStudio />;
      case 'brandkit':
        return <BrandKitTab />;
      case 'history':
        return <HistoryTab />;
      case 'dashboard':
        return <OverviewTab />;
      default:
        return <CanvasStudio />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#07090e] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
