import { Font } from "@react-pdf/renderer";

// Disable hyphenation (Swedish words break badly)
Font.registerHyphenationCallback((word) => [word]);

// Using built-in Helvetica for reliability on serverless.
// react-pdf includes Courier, Helvetica, Times-Roman by default.
// No external font downloads needed.
