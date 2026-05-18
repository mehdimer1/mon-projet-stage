import type { SVGProps } from 'react';

export function Replit(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
      <rect x="8" y="8" width="32" height="32" rx="8" fill="#0f172a" />
      <path
        d="M16 24l8 8 12-16"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
