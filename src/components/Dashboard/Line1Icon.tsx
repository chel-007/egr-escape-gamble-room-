import { memo, SVGProps } from 'react';

const Line1Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 0 46' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path d='M0 46L0 3.02206e-07' stroke='#E0A301' strokeWidth={2.5} strokeLinecap='round' />
  </svg>
);

const Memo = memo(Line1Icon);
export { Memo as Line1Icon };
