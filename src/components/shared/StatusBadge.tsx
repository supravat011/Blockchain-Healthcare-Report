interface StatusBadgeProps {
  status: 'active' | 'pending' | 'revoked' | 'expired' | 'approved' | 'rejected' | 'verified' | 'unverified';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    active: { label: 'Active', className: 'status-active' },
    approved: { label: 'Approved', className: 'status-active' },
    verified: { label: 'Verified', className: 'status-active' },
    pending: { label: 'Pending', className: 'status-pending' },
    revoked: { label: 'Revoked', className: 'status-revoked' },
    expired: { label: 'Expired', className: 'status-revoked' },
    rejected: { label: 'Rejected', className: 'status-revoked' },
    unverified: { label: 'Unverified', className: 'status-pending' },
  };

  const config = statusConfig[status];

  return (
    <span className={`status-badge ${config.className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
