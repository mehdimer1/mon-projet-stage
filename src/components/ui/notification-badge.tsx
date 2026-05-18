'use client';

import { Badge } from '@heroui/react';

interface NotificationBadgeProps {
  count?: number;
  variant?: 'count' | 'dot';
  children: React.ReactNode;
  className?: string;
}

export default function NotificationBadge({
  count = 0,
  variant = 'count',
  children,
  className,
}: NotificationBadgeProps) {
  const visible = variant === 'dot' || count > 0;

  if (!visible) {
    return <>{children}</>;
  }

  return (
    <Badge.Anchor className={className}>
      {children}
      {variant === 'dot' ? (
        <Badge color="danger" size="sm" />
      ) : (
        <Badge color="danger" size="sm">
          {count > 99 ? '99+' : count}
        </Badge>
      )}
    </Badge.Anchor>
  );
}
