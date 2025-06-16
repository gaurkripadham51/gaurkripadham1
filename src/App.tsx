import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Festivals from './pages/Festivals';
import Donations from './pages/Donations';
import Programs from './pages/Programs';
import InitiationForm from './pages/InitiationForm';
import DevoteeList from './pages/DevoteeList';
import GuruPurnimaRegistrationForm from './pages/GuruPurnimaRegistrationForm';
import EkadashiKirtanList from './pages/EkadashiKirtanList';
import BhajanList from './pages/BhajanList';
import BookList from './pages/BookList';
import BookIndex from './pages/BookIndex';
import PageText from './pages/PageText';
import AdminPanel from './pages/AdminPanel';

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
          <Route path="/AdminPanel" element={<AdminPanel />} />
          <Route path="/InitiationForm" element={<InitiationForm />} />
          <Route path="/GuruPurnimaRegistration" element={<GuruPurnimaRegistrationForm />} />
          <Route path="/DevoteeList" element={<DevoteeList />} />
          <Route path="/EkadashiKirtanList" element={<EkadashiKirtanList />} />
          <Route path="/bhajanlist" element={<BhajanList />} />
          <Route path="/books" element={<BookList />} />
        <Route path="/book/:bookId" element={<BookIndex />} />
        <Route path="/book/:bookId/page/:pageId" element={<PageText />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;