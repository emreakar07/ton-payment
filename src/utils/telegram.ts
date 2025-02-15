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
  return window.Telegram?.WebApp != null;
}; 