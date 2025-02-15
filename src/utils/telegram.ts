import WebApp from '@twa-dev/sdk';

// WebApp tipini genişletmek yerine yeni bir tip tanımlayalım
interface TelegramTheme {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
}

// vite-env.d.ts ile çakışmayı önlemek için
declare global {
  var Telegram: {
    WebApp: WebApp & Partial<TelegramTheme>;
  }
}

export const validateTelegramWebAppData = (initData: string) => {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    const authDate = urlParams.get('auth_date');
    
    if (!hash || !authDate) {
      return false;
    }

    // Auth date kontrolü (24 saat geçerliliği)
    const authDateNum = parseInt(authDate);
    if (Date.now() / 1000 - authDateNum > 86400) {
      return false;
    }

    // TODO: Hash doğrulaması eklenebilir
    // Bu kısım backend'de yapılmalı

    return true;
  } catch (e) {
    console.error('Telegram WebApp data validation error:', e);
    return false;
  }
};

export const isTelegramWebApp = () => {
  return typeof window !== 'undefined' && 'Telegram' in window && 'WebApp' in window.Telegram;
};

export const initTelegramWebApp = () => {
  if (!isTelegramWebApp()) {
    console.warn('Telegram WebApp is not available');
    return;
  }

  // WebApp'i hazır hale getir
  WebApp.ready();

  // Main button'u ayarla
  WebApp.MainButton.setText('CONNECT WALLET');
  WebApp.MainButton.show();
  WebApp.MainButton.enable();

  // Tema renklerini ayarla
  const tg = window.Telegram.WebApp;
  
  // CSS değişkenlerini güvenli bir şekilde ayarla
  const setThemeProperty = (prop: string, value: string | undefined) => {
    if (value) {
      document.documentElement.style.setProperty(prop, value);
    }
  };

  setThemeProperty('--tg-theme-bg-color', tg.backgroundColor);
  setThemeProperty('--tg-theme-text-color', tg.textColor);
  setThemeProperty('--tg-theme-button-color', tg.buttonColor);
  setThemeProperty('--tg-theme-button-text-color', tg.buttonTextColor);
}; 