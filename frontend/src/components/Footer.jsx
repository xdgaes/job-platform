import React from "react";

function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center py-8 bg-white border-t border-gray-100 mt-10">
      <div className="flex items-center gap-4 mb-4">
        <img src="/logo.svg" alt="Logo" className="h-8" />
        <p className="text-sm text-gray-600">© 2025 CLIPPA</p>
      </div>
      <div className="flex gap-6 text-sm text-gray-500">
        <a href="#">Contact Us</a>
        <a href="#">Terms of Service</a>
        <a href="#">Privacy Policy</a>
      </div>
    </footer>
  );
}

export default Footer;
