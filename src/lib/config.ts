let apiBaseUrl: string = "";

export const loadConfig = async () => {
  const config = await window.electron.getConfig();
  apiBaseUrl = config.apiBaseUrl;
};

export const getApiBaseUrl = () => {
  if (!apiBaseUrl) {
    throw new Error("API base URL not initialized. Call loadConfig() first.");
  }
  return apiBaseUrl;
};
