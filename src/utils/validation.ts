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

export const validatePaymentData = (data: any) => {
  if (!data?.address || !data?.amount) {
    throw new Error('Invalid payment data format');
  }

  // TON adres formatını kontrol et
  if (!/^[0-9A-Za-z_-]{48}$/.test(data.address)) {
    throw new Error('Invalid TON address');
  }

  // Miktar kontrolü
  const amount = parseFloat(data.amount);
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid amount');
  }

  return true;
}; 