import { ConfigProvider, theme } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import { useState } from "react";

export default function AntdProvider({ children }) {
  const [isDark] = useState(true);

  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            // Primary - Bottle Green
            colorPrimary: "#004225",
            colorSuccess: "#004225",
            colorWarning: "#FFB000",
            colorInfo: "#1677ff",
            colorError: "#ff4d4f",
            colorLink: "#FFB000",
            colorLinkHover: "#FFCF9D",
            colorLinkActive: "#e69d00",

            // BG
            colorBgContainer: "#141414",
            colorBgElevated: "#1f1f1f",
            colorBgLayout: "#000000",
            colorBgSpotlight: "#262626",

            borderRadius: 6,
          },
          components: {
            Menu: {
              itemColor: "#ffffff",
              itemHoverColor: "#FFB000",
              itemSelectedColor: "#FFB000",
              itemSelectedBg: "#004225",
              itemHoverBg: "rgba(0, 66, 37, 0.2)",
              itemActiveBg: "#003419",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}
