import type { AppProps } from 'next/app';
import React from 'react';

export default function VeriPayEngineApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        /* Production Global Design System Styles */
        html, body {
          padding: 0;
          margin: 0;
          background-color: #020617; /* Deep Slate 950 */
          color: #f8fafc; /* Slate 50 */
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        * {
          box-sizing: border-box;
        }

        /* Smooth animation fade transitions for layout cards */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
