import { memo, SVGProps } from 'react';

const VectorIcon2 = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 17 20' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <g
      style={{
        mixBlendMode: 'hard-light',
      }}
    >
      <path d='M13.5116 19.5352L17 -3.59461e-08L0.255785 11.4517H9.32557L13.5116 19.5352Z' fill='#989898' />
    </g>
  </svg>
);

const Memo = memo(VectorIcon2);
export { Memo as VectorIcon2 };
