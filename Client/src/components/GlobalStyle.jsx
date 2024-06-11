// src/globalStyles.js or src/index.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Helvetica:wght@400;700&family=Garamond:wght@400;700&display=swap');

  :root {
    --primary-blue: #002347;
    --secondary-blue: #003366;
    --tertiary-blue: #003F7D;
  }

  html {
    font-size: 100%; /* 16px */
    font-family: 'Helvetica', sans-serif;  /* Default font family */
  }

  body {
    font-family: 'Helvetica', sans-serif;  /* Default body font */
    font-size: 1rem; /* 16px */
    line-height: 1.6;
    color: var(--primary-blue); /* Base font color */
    background-color: #ffffff; /* Assuming white background */
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Garamond', serif;  /* Font for headings */
    margin-top: 0;
    margin-bottom: 0.5em;
    line-height: 1.2;
    color: var(--secondary-blue); /* Heading color */
  }

  p, a, span, div, li, ul, ol, input, button, textarea {
    font-family: 'Helvetica', sans-serif;  /* Ensure all elements use the default body font */
  }

  h1 {
    font-size: 2.5rem; /* 40px */
  }

  h2 {
    font-size: 2rem; /* 32px */
  }

  h3 {
    font-size: 1.75rem; /* 28px */
  }

  h4 {
    font-size: 1.5rem; /* 24px */
  }

  h5 {
    font-size: 1.25rem; /* 20px */
  }

  h6 {
    font-size: 1rem; /* 16px */
  }

  @media (max-width: 1200px) {
    h1 {
      font-size: 2.25rem; /* 36px */
    }

    h2 {
      font-size: 1.875rem; /* 30px */
    }

    h3 {
      font-size: 1.625rem; /* 26px */
    }

    h4 {
      font-size: 1.375rem; /* 22px */
    }

    h5 {
      font-size: 1.125rem; /* 18px */
    }

    h6 {
      font-size: 0.875rem; /* 14px */
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem; /* 32px */
    }

    h2 {
      font-size: 1.75rem; /* 28px */
    }

    h3 {
      font-size: 1.5rem; /* 24px */
    }

    h4 {
      font-size: 1.25rem; /* 20px */
    }

    h5 {
      font-size: 1rem; /* 16px */
    }

    h6 {
      font-size: 0.75rem; /* 12px */
    }
  }
`;

export default GlobalStyle;
