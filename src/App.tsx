import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Festivals from './pages/Festivals';
import Donations from './pages/Donations';
import Programs from './pages/Programs';


function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/festivals" element={<Festivals />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/programs" element={<Programs />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;