/**
 * @file postcss.config.js
 * @description Why this file exists: To configure the PostCSS processor which handles transpiling CSS styles in our build chain.
 * @description Responsibility: Registers the Tailwind CSS compiler and Autoprefixer to resolve and prefix target browser utility rules during development and build compilation.
 */

export default {
  plugins: {
    // Enable the Tailwind CSS compiler plugin
    tailwindcss: {},
    // Enable Autoprefixer to automatically append browser-specific vendor prefixes (e.g. -webkit, -moz)
    autoprefixer: {},
  },
}

/**
 * Line-by-line Explanation:
 * Line 7: Exports standard ES module config parameters.
 * Line 10: Includes 'tailwindcss' in plugins list to process custom directives (@tailwind).
 * Line 12: Includes 'autoprefixer' to automatically calculate cross-browser compatibility declarations.
 */
