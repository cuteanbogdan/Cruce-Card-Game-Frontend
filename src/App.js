import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GameInterface from './pages/GameInterface';
import Game from './pages/Game';
import Login from "./pages/Login"
import Signup from "./pages/Signup"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<GameInterface />} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
