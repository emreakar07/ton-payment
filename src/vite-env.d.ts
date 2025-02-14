/// <reference types="vite/client" />

declare module '@twa-dev/sdk' {
  interface WebApp {
    ready: () => void;
    expand: () => void;
    close: () => void;
    showProgress: () => void;
    hideProgress: () => void;
    
    MainButton: {
      show: () => void;
      hide: () => void;
      setText: (text: string) => void;
      onClick: (callback: () => void) => void;
      offClick: (callback: () => void) => void;
      enable: () => void;
      disable: () => void;
    };
    
    showPopup: (params: {
      title?: string;
      message: string;
      buttons?: Array<{
        type?: 'ok' | 'close' | 'cancel' | 'destructive';
        text?: string;
        id?: string | number;
      }>;
    }) => void;
    
    colorScheme: 'light' | 'dark';
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
    themeParams: {
      bg_color: string;
      text_color: string;
      hint_color: string;
      link_color: string;
      button_color: string;
      button_text_color: string;
    };

    // Telegram WebApp'den gelen başlangıç verisi
    initDataUnsafe: {
      query_id?: string;
      user?: {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
        language_code?: string;
      };
      receiver?: {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
      };
      chat?: {
        id: number;
        type: string;
        title: string;
      };
      start_param?: string;
      auth_date: number;
      hash: string;
    };

    initData: string;
  }

  const WebApp: WebApp;
  export default WebApp;
}
