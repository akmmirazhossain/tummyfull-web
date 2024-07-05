// pages/_app.js
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AppRouterCacheProvider>
      <Component {...pageProps} />
    </AppRouterCacheProvider>
  );
}
