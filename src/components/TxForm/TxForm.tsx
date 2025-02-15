import React, {useCallback, useEffect, useState} from 'react';
import './style.scss';
import {SendTransactionRequest, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import WebApp from '@twa-dev/sdk';

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

export function TxForm() {
	const [tx, setTx] = useState<SendTransactionRequest>(defaultTx);
	const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
	const wallet = useTonWallet();
	const [tonConnectUi] = useTonConnectUI();

	// URL'den payment_data parametresini al
	useEffect(() => {
		try {
			const urlParams = new URLSearchParams(window.location.search);
			const paymentDataStr = urlParams.get('payment_data');
			
			if (paymentDataStr) {
				// Base64 decode ve JSON parse
				const paymentData = JSON.parse(atob(paymentDataStr));
				
				setTx(prev => ({
					...prev,
					messages: [{
						address: paymentData.address,
						amount: paymentData.amount,
					}]
				}));
			}
		} catch (e) {
			console.error('Error parsing payment data:', e);
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

		if (!paymentData || !tx.messages[0].address || !tx.messages[0].amount) {
			WebApp.showPopup({
				title: 'Error',
				message: 'Invalid payment data',
				buttons: [{type: 'ok'}]
			});
			return;
		}

		try {
			WebApp.showProgress();
			await tonConnectUi.sendTransaction(tx);
			
			// İşlem başarılı olduğunda bot'a bilgi gönder
			WebApp.sendData(JSON.stringify({
				event: 'payment_success',
				orderId: paymentData.orderId,
				transactionAmount: paymentData.amount,
				walletAddress: wallet.account.address
			}));

			showSuccess();
			WebApp.close();
		} catch (error) {
			handleError(error);
		} finally {
			WebApp.hideProgress();
		}
	}, [wallet, tonConnectUi, tx, paymentData]);

	// Main Button'a tıklama olayını ekle
	useEffect(() => {
		if (!wallet) {
			WebApp.MainButton.setText('CONNECT WALLET');
			WebApp.MainButton.onClick(() => tonConnectUi.openModal());
		} else if (paymentData) {
			WebApp.MainButton.setText(`PAY ${paymentData.amount} TON`);
			WebApp.MainButton.onClick(handleTransaction);
		}

		return () => {
			WebApp.MainButton.offClick();
			WebApp.MainButton.hide();
		};
	}, [wallet, paymentData, handleTransaction]);

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

	const showSuccess = () => {
		WebApp.showPopup({
			title: 'Success',
			message: 'Payment completed!',
			buttons: [{
				type: 'ok',
				text: 'Done',
				id: 'success_done'
			}]
		});
	};

	return (
		<div className="send-tx-form" style={{color: WebApp.textColor}}>
			<h3>Payment Details</h3>
			{paymentData && (
				<div className="payment-details">
					<p>Product: {paymentData.productName}</p>
					<p>Amount: {paymentData.amount} TON</p>
					<p>Order ID: {paymentData.orderId}</p>
					<p className="address">To: {paymentData.address}</p>
				</div>
			)}
		</div>
	);
}
