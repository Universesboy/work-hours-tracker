import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaCalendarAlt, FaChartBar } from 'react-icons/fa';

interface HeaderProps {
  viewMode: 'month' | 'year';
  onToggleView: () => void;
}

const Header: React.FC<HeaderProps> = ({ viewMode, onToggleView }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header>
      <div className="header-content">
        <div>
          <h1>Work Hours Tracker</h1>
          <p className="subtitle">Track and manage your work hours efficiently</p>
        </div>
        <div className="header-buttons">
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' 
              ? <span className="icon"><FaMoon /></span> 
              : <span className="icon"><FaSun /></span>}
          </button>
          <button 
            className="view-toggle-btn"
            onClick={onToggleView}
          >
            {viewMode === 'month' 
              ? <><span className="icon"><FaChartBar /></span> View Yearly Summary</>
              : <><span className="icon"><FaCalendarAlt /></span> Back to Monthly View</>
            }
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;