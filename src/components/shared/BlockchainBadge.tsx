import { Link2, Lock, CheckCircle, Shield } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BlockchainBadgeProps {
  transactionHash?: string;
  ipfsHash?: string;
  verified?: boolean;
  size?: 'sm' | 'md';
}

export function BlockchainBadge({ transactionHash, ipfsHash, verified = true, size = 'sm' }: BlockchainBadgeProps) {
  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-2">
      {transactionHash && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="blockchain-badge cursor-help">
              <Link2 className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
              <span>{truncateHash(transactionHash)}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-mono text-xs">TX: {transactionHash}</p>
          </TooltipContent>
        </Tooltip>
      )}
      
      {ipfsHash && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="blockchain-badge cursor-help">
              <Lock className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
              <span>IPFS</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-mono text-xs">IPFS: {ipfsHash}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {verified && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/10 text-success rounded text-xs font-medium cursor-help">
              <Shield className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
              <span>Verified</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>This record is verified on the blockchain</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
