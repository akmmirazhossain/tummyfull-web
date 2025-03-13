import React from "react";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-theme="light">
      <Head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-NBS25Q8PM5"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NBS25Q8PM5');
            `,
          }}
        />

        {/* Tawk.to */}

        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              function loadTawkTo() {
                var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/671937064304e3196ad6be94/1iat7tt48';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              }

              function initTawkTo() {
                // Check if we're on the home page
                if (window.location.pathname === '/home') {
                  // For home page, load after scroll
                  window.addEventListener('scroll', function() {
                    if (window.scrollY > 500) {
                      loadTawkTo();
                      window.removeEventListener('scroll', arguments.callee);
                    }
                  });
                } else {
                  // For other pages, load immediately
                  loadTawkTo();
                }
              }

              // Initialize once DOM is ready
              if (document.readyState === 'complete') {
                initTawkTo();
              } else {
                window.addEventListener('load', initTawkTo);
              }
            `,
          }}
        /> */}

        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/671937064304e3196ad6be94/1iat7tt48';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
