import {TonConnectButton} from "@tonconnect/ui-react";
import './header.scss';
import WebApp from '@twa-dev/sdk';

export const Header = () => {
    // Main Button'u göster
    WebApp.MainButton.setText('CONNECT WALLET');
    WebApp.MainButton.show();
    
    return <header style={{color: WebApp.textColor}}>
        <span>TON Wallet Mini App</span>
        <TonConnectButton />
    </header>
}
