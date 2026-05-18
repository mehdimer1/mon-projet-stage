import type { SVGProps } from 'react';

export function MediaWiki(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
      <rect x="8" y="8" width="32" height="32" rx="8" fill="#f97316" />
      <path d="M16 18h16M16 24h16M16 30h10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
