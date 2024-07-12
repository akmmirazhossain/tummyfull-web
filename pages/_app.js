// pages/_app.js
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ApiProvider } from "./contexts/ApiContext";

import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AppRouterCacheProvider>
      <ApiProvider>
        <Component {...pageProps} />
      </ApiProvider>
    </AppRouterCacheProvider>
  );
}
