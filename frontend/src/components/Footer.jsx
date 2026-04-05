/**
 * @file Footer.jsx
 * @description Why this file exists: To provide the global page footer.
 * @description Responsibility: Renders standard copyright statements, academic campus declarations, and structural links.
 */

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
        <p className="text-sm font-semibold text-white">StashIT Marketplace</p>
        <p className="text-xs">
          Exclusive second-hand marketplace for the students of Army Institute of Technology (AIT), Pune.
        </p>
        <p className="text-xs text-slate-500 pt-2 border-t border-slate-850 mt-4">
          &copy; {new Date().getFullYear()} StashIT. Built for AIT Pune community.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

/**
 * Line-by-line Explanation:
 * Line 7: Imports React.
 * Line 9: Declares Footer component.
 * Line 11: Renders dark charcoal theme footer (`bg-slate-900 text-slate-400`).
 * Line 12-19: Displays AIT campus statement details and updates the copyright year dynamically.
 */
