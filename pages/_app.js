// pages/_app.js
import React from "react";

// import { NotificationProvider } from "./contexts/NotificationContext";
// import { UserProvider } from "./contexts/UserContext";
// import { SettingProvider } from "./contexts/SettingContext";
import AntdProvider from "../providers/AntdProvider";

import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AntdProvider>
      <Component {...pageProps} />
    </AntdProvider>
  );
}
