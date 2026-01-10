interface MetaMaskError extends Error {
    code?: number;
}

export class MetaMaskService {
    /**
     * Check if MetaMask is installed
     */
    static isMetaMaskInstalled(): boolean {
        return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
    }

    /**
     * Request MetaMask connection and get wallet address
     */
    static async connectWallet(): Promise<string> {
        if (!this.isMetaMaskInstalled()) {
            throw new Error('MetaMask is not installed. Please install MetaMask extension to continue.');
        }

        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found. Please unlock MetaMask and try again.');
            }

            return accounts[0];
        } catch (error: any) {
            const metamaskError = error as MetaMaskError;

            // Handle user rejection
            if (metamaskError.code === 4001) {
                throw new Error('MetaMask connection was rejected. Please approve the connection to continue.');
            }

            throw new Error(metamaskError.message || 'Failed to connect to MetaMask');
        }
    }

    /**
     * Get current connected wallet address
     */
    static async getCurrentAccount(): Promise<string | null> {
        if (!this.isMetaMaskInstalled()) {
            return null;
        }

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts',
            });

            return accounts && accounts.length > 0 ? accounts[0] : null;
        } catch (error) {
            console.error('Error getting current account:', error);
            return null;
        }
    }

    /**
     * Listen for account changes
     */
    static onAccountsChanged(callback: (accounts: string[]) => void): void {
        if (!this.isMetaMaskInstalled()) {
            return;
        }

        window.ethereum.on('accountsChanged', callback);
    }

    /**
     * Listen for network changes
     */
    static onChainChanged(callback: (chainId: string) => void): void {
        if (!this.isMetaMaskInstalled()) {
            return;
        }

        window.ethereum.on('chainChanged', callback);
    }

    /**
     * Remove event listeners
     */
    static removeListener(event: string, callback: (...args: any[]) => void): void {
        if (!this.isMetaMaskInstalled()) {
            return;
        }

        window.ethereum.removeListener(event, callback);
    }
}

// Extend Window interface to include ethereum
declare global {
    interface Window {
        ethereum?: any;
    }
}
