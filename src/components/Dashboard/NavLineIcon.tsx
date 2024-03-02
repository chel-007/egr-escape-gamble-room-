import { memo, SVGProps } from 'react';

const NavLineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 100 0' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path d='M0 0H100' stroke='#E0A301' strokeWidth={1.5} strokeLinecap='round' />
  </svg>
);

const Memo = memo(NavLineIcon);
export { Memo as NavLineIcon };
