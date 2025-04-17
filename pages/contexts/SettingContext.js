import { createContext, useContext, useEffect, useState } from "react";
import { ApiContext } from "./ApiContext";
import axios from "axios";

const SettingContext = createContext(null);

export const SettingProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiConfig = useContext(ApiContext);

  useEffect(() => {
    if (!apiConfig) {
      return;
    }
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${apiConfig.apiBaseUrl}setting`);
        setSettings(res.data);
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [apiConfig]);

  return (
    <SettingContext.Provider value={{ settings, loading }}>
      {children}
    </SettingContext.Provider>
  );
};

export const useSettings = () => useContext(SettingContext);

const DummyUserContextComponent = () => (
  <div>This is a dummy export for UserContext</div>
);
export default DummyUserContextComponent;
