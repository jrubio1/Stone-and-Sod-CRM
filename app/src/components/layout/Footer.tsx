import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t p-4 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} My Application
    </footer>
  );
};

export default Footer;
