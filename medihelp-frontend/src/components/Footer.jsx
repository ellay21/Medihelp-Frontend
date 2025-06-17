import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} MediHelp. All rights reserved.</p>
        <p>
          <a href="/privacy" className="text-gray-400 hover:text-gray-300">Privacy Policy</a> | 
          <a href="/terms" className="text-gray-400 hover:text-gray-300"> Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;