import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
        {/* Top Section */}
        <div className="flex flex-col justify-center items-start mb-8 gap-3">
          {/* Logo and Description */}
          <div className="flex items-baseline gap-2 mb-0">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 3a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414 0l-7-7a1 1 0 0 1 0-1.414l7-7A1 1 0 0 1 12 3z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 14l4-4 4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xl font-display font-medium">Tracknourish</span>
          </div>
          <p className="text-gray-600 text-md text-center md:text-left">
            Simplifying nutrition tracking for a healthier lifestyle.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex justify-start gap-8 mb-6 ">
          {/* Main Links */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2 flex flex-col md:flex-row gap-2 md:gap-6">
              <li>
                <a
                  href="#features"
                  className="text-gray-600 hover:text-primary transition-colors text-sm"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-gray-600 hover:text-primary transition-colors text-sm"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-gray-600 hover:text-primary transition-colors text-sm"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          
        </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Tracknourish. All rights reserved.
          </p>
          {/* <ul className="flex gap-6 mt-4 md:mt-0">
            <li>
              <a
                href="https://twitter.com/"
                className="text-gray-600 hover:text-primary transition-colors text-sm"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com/"
                className="text-gray-600 hover:text-primary transition-colors text-sm"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/"
                className="text-gray-600 hover:text-primary transition-colors text-sm"
              >
                Instagram
              </a>
            </li>
          </ul> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;