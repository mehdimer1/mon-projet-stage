import type { SVGProps } from 'react';

export function VSCodium(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
      <rect x="6" y="6" width="36" height="36" rx="8" fill="#14b8a6" />
      <path d="M18 32l8-16 8 16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
