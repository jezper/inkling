import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Space Grotesk",
  fonts: [
    { src: "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPb94DQ.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.ttf", fontWeight: 700 },
  ],
});

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcvkYgY.ttf", fontWeight: 600 },
  ],
});

// Disable hyphenation (Swedish words break badly)
Font.registerHyphenationCallback((word) => [word]);
