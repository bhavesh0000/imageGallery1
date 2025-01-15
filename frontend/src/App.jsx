import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import GalleryList from './components/GalleryList';
import GalleryView from './components/GalleryView';
import './Gallery.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<GalleryList />} />
          <Route path="/gallery/:id" element={<GalleryView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;