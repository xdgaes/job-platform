import React from "react";

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 py-6 mt-auto shadow-inner border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="w-full px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Kiri */}
        <div className="text-indigo-700 dark:text-indigo-400 font-bold text-lg self-start md:self-center">
          © 2025 CLIPPA
        </div>

        {/* Kanan */}
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors">
            Contact Us
          </a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors">
            Terms
          </a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
