'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, updateUser } from '@/lib/storage';
import { DollarSign, Wallet as WalletIcon, PlusCircle, MinusCircle, Copy, QrCode, CheckCircle, AlertCircle } from 'lucide-react';
import { ButtonWithIcon } from '@/components/button-with-icon';
import { AlertBox } from '@/components/alert-box';
import { ModalBase } from '@/components/modal-base';
import { FuturisticInput } from '@/components/futuristic-input';
import { QRCodeCanvas } from 'qrcode.react'; // Corrected import for qrcode.react

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [alert, setAlert] = useState<{
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const hardcodedWalletAddress = '0x1234567890abcdef1234567890abcdef12345678'; // Example address

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/');
      return;
    }
    setUser(currentUser);
  }, [router]);

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setAlert({ show: true, type: 'error', title: 'Invalid Amount', message: 'Please enter a valid positive number.' });
      return;
    }
    if (user) {
      const newBalance = user.balance + depositAmount;
      const updatedUser = { ...user, balance: newBalance };
      updateUser(updatedUser);
      setUser(updatedUser);
      setAlert({ show: true, type: 'success', title: 'Deposit Successful', message: `$${depositAmount.toFixed(2)} USDC has been added to your account.` });
      setShowDepositModal(false);
      setAmount('');
    }
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setAlert({ show: true, type: 'error', title: 'Invalid Amount', message: 'Please enter a valid positive number.' });
      return;
    }
    if (user && withdrawAmount > user.balance) {
      setAlert({ show: true, type: 'error', title: 'Insufficient Funds', message: 'You do not have enough USDC to withdraw this amount.' });
      return;
    }
    if (user) {
      const newBalance = user.balance - withdrawAmount;
      const updatedUser = { ...user, balance: newBalance };
      updateUser(updatedUser);
      setUser(updatedUser);
      setAlert({ show: true, type: 'success', title: 'Withdrawal Successful', message: `$${withdrawAmount.toFixed(2)} USDC has been withdrawn from your account.` });
      setShowWithdrawModal(false);
      setAmount('');
    }
  };

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(hardcodedWalletAddress);
    setAlert({ show: true, type: 'success', title: 'Address Copied', message: 'Wallet address copied to clipboard!' });
  };

  if (!user) return null;

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-muted-foreground">Manage your USDC balance for micropayments and agent deployments.</p>
        </div>

        <div className="glass border-glow rounded-lg p-6 glow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <WalletIcon size={40} className="text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Current Balance</div>
              <div className="text-3xl font-bold text-primary">${user.balance.toFixed(2)} USDC</div>
            </div>
          </div>
          <div className="flex gap-4">
            <ButtonWithIcon
              icon={PlusCircle}
              label="Deposit"
              onClick={() => setShowDepositModal(true)}
              variant="primary"
            />
            <ButtonWithIcon
              icon={MinusCircle}
              label="Withdraw"
              onClick={() => setShowWithdrawModal(true)}
              variant="secondary"
            />
          </div>
        </div>

        {/* Transaction History (Placeholder) */}
        <div className="glass border-glow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Transaction History</h2>
          <p className="text-muted-foreground">Your recent wallet transactions will appear here.</p>
        </div>
      </div>

      <ModalBase
        isOpen={showDepositModal}
        title="Deposit USDC"
        description="Scan the QR code or copy the address below to deposit USDC."
        icon={PlusCircle}
        confirmLabel="Done"
        cancelLabel="Cancel"
        onConfirm={() => setShowDepositModal(false)} // No direct deposit action in modal
        onCancel={() => setShowDepositModal(false)}
      >
        <div className="mt-4 space-y-4">
          <div className="flex justify-center p-4 bg-muted rounded-md">
            <QRCodeCanvas value={hardcodedWalletAddress} size={200} level="H" />
          </div>
          <div className="flex items-center justify-between bg-input p-3 rounded-md border border-border/50">
            <span className="font-mono text-sm truncate">{hardcodedWalletAddress}</span>
            <ButtonWithIcon
              icon={Copy}
              label="Copy"
              onClick={copyAddressToClipboard}
              size="sm"
              variant="secondary"
            />
          </div>
        </div>
      </ModalBase>

      <ModalBase
        isOpen={showWithdrawModal}
        title="Withdraw USDC"
        description="Enter the amount of USDC you wish to withdraw from your wallet."
        icon={MinusCircle}
        confirmLabel="Withdraw"
        cancelLabel="Cancel"
        onConfirm={handleWithdraw}
        onCancel={() => setShowWithdrawModal(false)}
      >
        <div className="mt-4">
          <FuturisticInput
            icon={<DollarSign size={20} />}
            label="Amount"
            type="number"
            value={amount}
            onChange={setAmount}
            placeholder="e.g., 50.00"
          />
        </div>
      </ModalBase>

      {alert.show && (
        <AlertBox
          title={alert.title}
          description={alert.message}
          type={alert.type}
          icon={alert.type === 'success' ? CheckCircle : AlertCircle}
          onDismiss={() => setAlert({ ...alert, show: false })}
        />
      )}
    </>
  );
}
