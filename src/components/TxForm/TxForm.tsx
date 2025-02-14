import React, {useCallback, useEffect, useState} from 'react';
import ReactJson from 'react-json-view';
import './style.scss';
import {SendTransactionRequest, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import WebApp from '@twa-dev/sdk';

// In this example, we are using a predefined smart contract state initialization (`stateInit`)
// to interact with an "EchoContract". This contract is designed to send the value back to the sender,
// serving as a testing tool to prevent users from accidentally spending money.

interface SendParameters {
	address: string;
	amount: string;
}

const defaultTx: SendTransactionRequest = {
	// The transaction is valid for 10 minutes from now, in unix epoch seconds.
	validUntil: Math.floor(Date.now() / 1000) + 600,
	messages: [
		{
			// The receiver's address.
			address: '',
			// Amount to send in nanoTON. For example, 0.005 TON is 5000000 nanoTON.
			amount: '0',
			// (optional) State initialization in boc base64 format.
			stateInit: 'te6cckEBBAEAOgACATQCAQAAART/APSkE/S88sgLAwBI0wHQ0wMBcbCRW+D6QDBwgBDIywVYzxYh+gLLagHPFsmAQPsAlxCarA==',
			// (optional) Payload in boc base64 format.
			payload: 'te6ccsEBAQEADAAMABQAAAAASGVsbG8hCaTc/g==',
		},

		// Uncomment the following message to send two messages in one transaction.
		/*
    {
      // Note: Funds sent to this address will not be returned back to the sender.
      address: 'UQAuz15H1ZHrZ_psVrAra7HealMIVeFq0wguqlmFno1f3B-m',
      amount: toNano('0.01').toString(),
    }
    */

	],
};

export function TxForm() {
	const [tx, setTx] = useState<SendTransactionRequest>(defaultTx);
	const wallet = useTonWallet();
	const [tonConnectUi] = useTonConnectUI();

	// Telegram WebApp'den parametreleri al
	useEffect(() => {
		try {
			// WebApp.initDataUnsafe.start_param formatı: "address_amount"
			// Örnek: "EQB...123_5000000"
			const startParam = WebApp.initDataUnsafe.start_param;
			if (startParam) {
				const [address, amount] = startParam.split('_');
				
				setTx(prev => ({
					...prev,
					messages: [{
						address,
						amount,
					}]
				}));

				// Main Button'u güncelle
				WebApp.MainButton.setText(`SEND ${Number(amount) / 1e9} TON`);
			}
		} catch (e) {
			console.error('Error parsing start parameters:', e);
			WebApp.showPopup({
				title: 'Error',
				message: 'Invalid payment parameters',
				buttons: [{type: 'close'}]
			});
		}
	}, []);

	const handleTransaction = useCallback(async () => {
		if (!wallet) {
			WebApp.showPopup({
				title: 'Connect Wallet',
				message: 'Please connect your wallet first',
				buttons: [{type: 'ok'}]
			});
			return;
		}

		if (!tx.messages[0].address || !tx.messages[0].amount) {
			WebApp.showPopup({
				title: 'Error',
				message: 'Invalid transaction parameters',
				buttons: [{type: 'ok'}]
			});
			return;
		}

		try {
			WebApp.showProgress();
			await tonConnectUi.sendTransaction(tx);
			
			WebApp.showPopup({
				title: 'Success',
				message: 'Transaction sent successfully!',
				buttons: [{
					type: 'ok',
					text: 'Close',
					id: 'close'
				}]
			});
			
			// İşlem başarılı olduğunda bot'a bildir
			WebApp.close();
		} catch (error) {
			WebApp.showPopup({
				title: 'Error',
				message: 'Transaction failed.',
				buttons: [{type: 'ok'}]
			});
		} finally {
			WebApp.hideProgress();
		}
	}, [wallet, tonConnectUi, tx]);

	// Main Button'a tıklama olayını ekle
	useEffect(() => {
		WebApp.MainButton.onClick(handleTransaction);
		return () => {
			WebApp.MainButton.offClick(handleTransaction);
		};
	}, [handleTransaction]);

	return (
		<div className="send-tx-form" style={{color: WebApp.textColor}}>
			<h3>Payment Details</h3>
			<div className="payment-details">
				<p>Address: {tx.messages[0].address}</p>
				<p>Amount: {Number(tx.messages[0].amount) / 1e9} TON</p>
			</div>
			<button 
				onClick={handleTransaction}
				style={{
					backgroundColor: WebApp.buttonColor,
					color: WebApp.buttonTextColor
				}}
			>
				Send Transaction
			</button>
		</div>
	);
}
