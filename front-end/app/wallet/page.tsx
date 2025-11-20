'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, Wallet as WalletIcon, PlusCircle, MinusCircle, Copy, QrCode, CheckCircle, AlertCircle } from 'lucide-react';
import { ButtonWithIcon } from '@/components/button-with-icon';
import { AlertBox } from '@/components/alert-box';
import { ModalBase } from '@/components/modal-base';
import { FuturisticInput } from '@/components/futuristic-input';
import { QRCodeCanvas } from 'qrcode.react';
import { usePrivy } from '@privy-io/react-auth'; // Import usePrivy
import { useBalance } from 'wagmi'; // Import useBalance
import { formatUnits } from 'viem'; // Import formatUnits

export default function WalletPage() {
  const router = useRouter();
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

  const { user: privyUser, ready, authenticated } = usePrivy();

  const embeddedWallet = privyUser?.linkedAccounts.find(
    (account) => account.type === 'wallet' && account.walletClientType === 'privy'
  );
  const walletAddress = embeddedWallet?.address || '0x';
  const chainId = embeddedWallet?.chain?.chainId;
  const chainName = embeddedWallet?.chain?.name || 'N/A';

  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address: walletAddress as `0x${string}`,
    chainId: chainId ? parseInt(chainId, 10) : undefined,
    watch: true, // Keep watching for balance changes
  });

  const handleDeposit = () => {
    setAlert({ show: true, type: 'success', title: 'Deposit', message: 'Deposit functionality is not yet implemented. Please use the embedded wallet address to deposit funds directly.' });
    setShowDepositModal(false);
    setAmount('');
  };

  const handleWithdraw = () => {
    setAlert({ show: true, type: 'error', title: 'Withdraw', message: 'Withdrawal functionality is not yet implemented. Please manage funds directly from your embedded wallet.' });
    setShowWithdrawModal(false);
    setAmount('');
  };

  const copyAddressToClipboard = () => {
    if (walletAddress !== 'N/A') {
      navigator.clipboard.writeText(walletAddress);
      setAlert({ show: true, type: 'success', title: 'Address Copied', message: 'Wallet address copied to clipboard!' });
    } else {
      setAlert({ show: true, type: 'error', title: 'No Wallet Address', message: 'Cannot copy, embedded wallet address not found.' });
    }
  };

  if (!ready || !authenticated) return null;

  const displayBalance = balanceData
    ? (balanceData.formatted !== undefined
      ? parseFloat(balanceData.formatted).toFixed(4)
      : parseFloat(formatUnits(balanceData.value, balanceData.decimals)).toFixed(4))
    : '0.0000';
  const balanceSymbol = balanceData?.symbol || 'ETH';

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-muted-foreground">Manage your {balanceSymbol} balance for micropayments and agent deployments.</p>
        </div>

        <div className="glass border-glow rounded-lg p-6 glow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <WalletIcon size={40} className="text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Current Balance</div>
              <div className="text-3xl font-bold text-primary">
                {isBalanceLoading ? 'Loading...' : `$${displayBalance} ${balanceSymbol}`}
              </div>
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

        {/* Embedded Wallet Information */}
        <div className="glass border-glow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Embedded Wallet Details</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-input p-3 rounded-md border border-border/50">
              <span className="text-sm text-muted-foreground">Address:</span>
              <span className="font-mono text-sm truncate">{walletAddress}</span>
              <ButtonWithIcon
                icon={Copy}
                label="Copy"
                onClick={copyAddressToClipboard}
                size="sm"
                variant="secondary"
                disabled={walletAddress === 'N/A'}
              />
            </div>
            <div className="flex items-center justify-between bg-input p-3 rounded-md border border-border/50">
              <span className="text-sm text-muted-foreground">Network:</span>
              <span className="font-mono text-sm">{chainName}</span>
            </div>
            {/* Add more Privy wallet details here if needed */}
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
        title="Deposit Funds"
        description="Deposit functionality is not yet implemented. Please use the embedded wallet address to deposit funds directly."
        icon={PlusCircle}
        confirmLabel="Got it"
        onConfirm={() => setShowDepositModal(false)}
        onCancel={() => setShowDepositModal(false)}
      >
        <div className="mt-4 space-y-4">
          <div className="flex justify-center p-4 bg-muted rounded-md">
            {walletAddress !== '0x' ? (
              <QRCodeCanvas value={walletAddress} size={200} level="H" />
            ) : (
              <div className="text-muted-foreground">Wallet address not available for QR code.</div>
            )}
          </div>
          <div className="flex items-center justify-between bg-input p-3 rounded-md border border-border/50">
            <span className="font-mono text-sm truncate">{walletAddress}</span>
            <ButtonWithIcon
              icon={Copy}
              label="Copy"
              onClick={copyAddressToClipboard}
              size="sm"
              variant="secondary"
              disabled={walletAddress === '0x'}
            />
          </div>
        </div>
      </ModalBase>

      <ModalBase
        isOpen={showWithdrawModal}
        title="Withdraw Funds"
        description="Withdrawal functionality is not yet implemented. Please manage funds directly from your embedded wallet."
        icon={MinusCircle}
        confirmLabel="Got it"
        onConfirm={() => setShowWithdrawModal(false)}
        onCancel={() => setShowWithdrawModal(false)}
      >
        {/* No input needed for unimplemented withdrawal */}
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
