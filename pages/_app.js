// pages/_app.js
import React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ApiProvider } from "./contexts/ApiContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { UserProvider } from "./contexts/UserContext";
import { SettingProvider } from "./contexts/SettingContext";

import "../styles/globals.css";

// eslint-disable-next-line react/prop-types
export default function App({ Component, pageProps }) {
  return (
    <AppRouterCacheProvider>
      <ApiProvider>
        <SettingProvider>
          <UserProvider>
            <NotificationProvider>
              <Component {...pageProps} />
            </NotificationProvider>
          </UserProvider>
        </SettingProvider>
      </ApiProvider>
    </AppRouterCacheProvider>
  );
}
