import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import FoodEntry from './FoodEntry';
import Login from './Login';
import MealPlanner from './MealPlanner';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <Router>
      <div style={{ backgroundColor: '#fdf6ee', minHeight: '100vh' }}>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg mb-4" style={{ backgroundColor: '#5a3e2b' }}>
          <div className="container-fluid">
            <Link className="navbar-brand text-light" to="/">IST363 - FoodTrackerr</Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarContent"
              aria-controls="navbarContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
  
            <div className="collapse navbar-collapse" id="navbarContent">
              {currentUser && (
                <>
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <Link to="/" className="nav-link text-light">Food Log</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/meal-planner" className="nav-link text-light">Meal Planner</Link>
                    </li>
                  </ul>
                  <button className="btn btn-outline-light ms-lg-3 mt-2 mt-lg-0" onClick={handleLogout}>
                    Switch User
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
  
        {/* Main Content */}
        <div className="container">
          {!currentUser ? (
            <Login onLogin={setCurrentUser} />
          ) : (
            <Routes>
              <Route path="/" element={<FoodEntry username={currentUser} />} />
              <Route path="/meal-planner" element={<MealPlanner username={currentUser} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
  
}

export default App;
