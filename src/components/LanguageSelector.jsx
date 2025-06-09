import React from 'react';

const LanguageSelector = ({ language, setLanguage }) => (
  <div className="language-selector" style={{ position: 'absolute', top: 20, right: 20 }}>
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      style={{
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: '#f9f1e7',
        color: '#4b3f35',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
    >
      <option value="zh">繁體中文</option>
    <option value="en">English</option>
    <option value="jp">日本語</option>
    <option value="kr">한국어</option>
    <option value="fr">Français</option>
    <option value="ru">Русский</option>
    </select>
  </div>
);

export default LanguageSelector;