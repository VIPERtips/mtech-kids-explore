declare global {
  interface Window {
    electron?: {
      getConfig: () => Promise<{ apiBaseUrl: string }>;
      
    };
  }
}
export {};
