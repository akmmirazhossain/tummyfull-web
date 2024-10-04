// pages/_app.js
import React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ApiProvider } from "./contexts/ApiContext";
import { NotificationProvider } from "./contexts/NotificationContext";

import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AppRouterCacheProvider>
      <ApiProvider>
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </ApiProvider>
    </AppRouterCacheProvider>
  );
}
