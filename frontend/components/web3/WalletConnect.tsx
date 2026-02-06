'use client';

import { useState } from 'react';
import { BrowserProvider } from 'ethers';

export default function WalletConnect() {
    const [account, setAccount] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const connectWallet = async () => {
        setIsConnecting(true);
        setError(null);

        try {
            // Check if MetaMask is installed
            if (typeof window.ethereum === 'undefined') {
                throw new Error('Please install MetaMask to use this platform');
            }

            // Request account access
            const provider = new BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);

            if (accounts.length === 0) {
                throw new Error('No accounts found');
            }

            // Check network
            const network = await provider.getNetwork();
            const sepoliaChainId = process.env.NEXT_PUBLIC_SEPOLIA_CHAIN_ID || '11155111';

            if (network.chainId.toString() !== sepoliaChainId) {
                try {
                    // Try to switch to Sepolia
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: `0x${parseInt(sepoliaChainId).toString(16)}` }],
                    });
                } catch (switchError: any) {
                    if (switchError.code === 4902) {
                        alert('Please add Sepolia test network to MetaMask');
                    }
                    throw switchError;
                }
            }

            setAccount(accounts[0]);

            // Listen for account changes
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', () => window.location.reload());

        } catch (err: any) {
            setError(err.message || 'Failed to connect wallet');
            console.error('Wallet connection error:', err);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
            setAccount(null);
        } else {
            setAccount(accounts[0]);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
    };

    return (
        <div>
            {!account ? (
                <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="btn-primary disabled:opacity-50"
                >
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
            ) : (
                <div className="flex items-center gap-3">
                    <div className="glass-card px-4 py-2 text-sm">
                        {account.substring(0, 6)}...{account.substring(account.length - 4)}
                    </div>
                    <button onClick={disconnectWallet} className="btn-secondary text-sm px-3 py-2">
                        Disconnect
                    </button>
                </div>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}
