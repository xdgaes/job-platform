import React from "react";

function Footer() {
  return (
    <footer className="bg-white py-6 mt-auto shadow-inner">
      <div className="w-full px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Kiri */}
        <div className="text-indigo-700 font-bold text-lg self-start md:self-center">
          © 2025 CLIPPA
        </div>

        {/* Kanan */}
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="text-gray-600 hover:text-indigo-700">
            Contact Us
          </a>
          <a href="#" className="text-gray-600 hover:text-indigo-700">
            Terms
          </a>
          <a href="#" className="text-gray-600 hover:text-indigo-700">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
