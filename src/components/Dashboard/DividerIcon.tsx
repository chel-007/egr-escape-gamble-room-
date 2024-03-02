import { memo, SVGProps } from 'react';

const DividerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 1285 0' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path d='M0 0L1285 -0.00234365' stroke='#50576A' strokeLinecap='round' />
  </svg>
);

const Memo = memo(DividerIcon);
export { Memo as DividerIcon };
