import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import PropertiesPanel from './components/PropertiesPanel';
import Scene from './components/Scene';
import Toolbar from './components/Toolbar';
import useStore from './hooks/useStore';

function App() {
  const { theme, selectedId, deleteObject, duplicateObject } = useStore();

  useEffect(() => {
    if (theme === 'Dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) deleteObject(selectedId);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (selectedId) duplicateObject(selectedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, deleteObject, duplicateObject]);

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden font-sans ${theme === 'Dark' ? 'dark bg-dark-bg text-dark-text' : 'bg-light-bg text-light-text'}`}>
      <Toolbar />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <Scene />
        <PropertiesPanel />
      </div>
    </div>
  );
}

export default App;
