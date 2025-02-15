import React, {useCallback, useEffect, useState} from 'react';
import './style.scss';
import {SendTransactionRequest, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import WebApp from '@twa-dev/sdk';
import { initTelegramWebApp } from '../../utils/telegram';
import { validatePaymentData } from '../../utils/validation';

interface PaymentData {
	amount: string;
	address: string;
	orderId: string;
	productName: string;
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
		},
	],
};

export const TxForm: React.FC = () => {
	const [tx, setTx] = useState<SendTransactionRequest>(defaultTx);
	const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
	const wallet = useTonWallet();
	const [tonConnectUI] = useTonConnectUI();

	useEffect(() => {
		initTelegramWebApp();
		
		// URL'den payment_data parametresini al
		try {
			const urlParams = new URLSearchParams(window.location.search);
			const paymentDataStr = urlParams.get('payment_data');
			
			if (paymentDataStr) {
				const data = JSON.parse(atob(paymentDataStr));
				if (validatePaymentData(data)) {
					setPaymentData(data);
					setTx(prev => ({
						...prev,
						messages: [{
							address: data.address,
							amount: data.amount,
						}]
					}));

					WebApp.MainButton.setText(`PAY ${data.amount} TON`);
					WebApp.MainButton.show();
				}
			}
		} catch (e) {
			console.error('Error parsing payment data:', e);
			WebApp.showPopup({
				title: 'Error',
				message: 'Invalid payment parameters',
				buttons: [{type: 'close'}]
			});
		}
	}, []);

	// Cüzdan bağlantı durumunu kontrol et
	useEffect(() => {
		const isConnected = tonConnectUI.connected;
		if (isConnected) {
			WebApp.MainButton.setText('SEND TRANSACTION');
			WebApp.MainButton.onClick(handleTransaction);
		} else {
			WebApp.MainButton.setText('CONNECT WALLET');
			WebApp.MainButton.onClick(() => tonConnectUI.openModal());
		}

		return () => {
			WebApp.MainButton.offClick();
		};
	}, [tonConnectUI.connected]);

	const handleTransaction = useCallback(async () => {
		if (!wallet || !paymentData) return;

		try {
			WebApp.showProgress();
			await tonConnectUI.sendTransaction(tx);
			
			// İşlem başarılı
			WebApp.showPopup({
				title: 'Success',
				message: 'Transaction sent successfully',
				buttons: [{type: 'close'}]
			});
		} catch (error) {
			handleError(error);
		} finally {
			WebApp.hideProgress();
		}
	}, [wallet, tonConnectUI, tx, paymentData]);

	const handleError = (error: any) => {
		WebApp.showPopup({
			title: 'Error',
			message: error.message || 'Transaction failed',
			buttons: [{
				type: 'destructive',
				text: 'Close'
			}]
		});
	};

	return (
		<div className="tx-form">
			{paymentData && (
				<div className="payment-details">
					<p>Product: {paymentData.productName}</p>
					<p>Amount: {paymentData.amount} TON</p>
					<p>Order ID: {paymentData.orderId}</p>
					<p>To: {paymentData.address}</p>
				</div>
			)}
		</div>
	);
};
