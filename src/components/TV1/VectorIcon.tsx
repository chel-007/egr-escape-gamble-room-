import { memo, SVGProps } from 'react';

const VectorIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 17 20' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <g
      style={{
        mixBlendMode: 'hard-light',
      }}
    >
      <path d='M13.5117 19.5352L17.0001 1.54857e-05L0.255871 11.4517H9.32565L13.5117 19.5352Z' fill='#FFD028' />
    </g>
  </svg>
);

const Memo = memo(VectorIcon);
export { Memo as VectorIcon };
