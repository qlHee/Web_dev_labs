import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import User from './pages/User';
import Question from './pages/Question';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/user" replace />} />
          <Route path="user" element={<User />} />
          <Route path="question" element={<Question />} />
        </Route>
        <Route path="*" element={<Navigate to="/user" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
