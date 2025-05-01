import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to AI MCQ Builder</h1>
        <p className="text-xl md:text-2xl mb-8">Create multiple choice questions with ease using our AI-powered tool.</p>
        <Link to="/form">
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            style={{ backgroundColor: '#f3f4f6', color: '#3b82f6' }}
          >
            Get Started
          </Button>
        </Link>
      </div>
    </header>
  );
}

export default Header;