import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import QueryForm from './components/QueryForm';
import './chart.css';
import DisplayResult from './components/DisplayResult';
import QueryResultPage from './components/QueryResultPage';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/query" element={<QueryForm />} />
        <Route path="/result" element={<DisplayResult />} />
        <Route path="/query-result" element={<QueryResultPage />} />

      </Routes>
    </Router>
  </React.StrictMode>
);