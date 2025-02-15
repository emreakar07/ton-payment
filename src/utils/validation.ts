export const validateTelegramParams = (initData: string) => {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    // Hash doğrulaması yapılabilir
    return true;
  } catch (e) {
    return false;
  }
}; 