import { TonConnectUIProvider } from '@tonconnect/ui-react';

const manifestUrl = 'https://t.me/electronicpinbot/app/tonconnect-manifest.json';

export const TonConnectProvider = ({ children }) => {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}; 