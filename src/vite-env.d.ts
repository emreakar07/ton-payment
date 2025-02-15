/// <reference types="vite/client" />

interface Window {
  Telegram?: {
    WebApp: {
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
      platform: string;
      version: string;
      viewportHeight: number;
      viewportStableHeight: number;
      isExpanded: boolean;
      CloudStorage: {
        getItem: (key: string) => Promise<string | null>;
        setItem: (key: string, value: string) => Promise<void>;
        removeItem: (key: string) => Promise<void>;
        getKeys: () => Promise<string[]>;
        removeItems: (keys: string[]) => Promise<void>;
        clear: () => Promise<void>;
      };
      
      expand: () => void;
      isVersionAtLeast: (version: string) => boolean;
      setBackgroundColor: (color: string) => void;
      enableClosingConfirmation: () => void;
      disableClosingConfirmation: () => void;
      onEvent: (eventType: string, callback: Function) => void;
      offEvent: (eventType: string, callback: Function) => void;
      sendData: (data: any) => void;
      openLink: (url: string) => void;
      openTelegramLink: (url: string) => void;
      openInvoice: (url: string) => void;
    };
  };
}

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
      offClick: (callback?: () => void) => void;
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
    platform: string;
    version: string;
    viewportHeight: number;
    viewportStableHeight: number;
    isExpanded: boolean;
    CloudStorage: {
      getItem: (key: string) => Promise<string | null>;
      setItem: (key: string, value: string) => Promise<void>;
      removeItem: (key: string) => Promise<void>;
      getKeys: () => Promise<string[]>;
      removeItems: (keys: string[]) => Promise<void>;
      clear: () => Promise<void>;
    };

    sendData: (data: any) => void;
    offClick: () => void;
  }

  const WebApp: WebApp;
  export default WebApp;
}
