import { memo, SVGProps } from 'react';

const BalanceIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 95 36' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <g filter='url(#filter0_d_92_786)'>
      <path
        d='M6 14V10C6 4.47715 10.4772 0 16 0H85C90.5228 0 95 4.47715 95 10V26C95 31.5228 90.5228 36 85 36H16C10.4772 36 6 31.5228 6 26V21.5'
        stroke='url(#paint0_linear_92_786)'
        strokeWidth={2}
        shapeRendering='crispEdges'
      />
    </g>
    <path
      d='M6 12C2.68548 12 0 14.6855 0 18C0 21.3145 2.68548 24 6 24C9.31452 24 12 21.3145 12 18C12 14.6855 9.31452 12 6 12ZM9.48387 18.6774C9.48387 18.8371 9.35323 18.9677 9.19355 18.9677H6.96774V21.1935C6.96774 21.3532 6.8371 21.4839 6.67742 21.4839H5.32258C5.1629 21.4839 5.03226 21.3532 5.03226 21.1935V18.9677H2.80645C2.64677 18.9677 2.51613 18.8371 2.51613 18.6774V17.3226C2.51613 17.1629 2.64677 17.0323 2.80645 17.0323H5.03226V14.8065C5.03226 14.6468 5.1629 14.5161 5.32258 14.5161H6.67742C6.8371 14.5161 6.96774 14.6468 6.96774 14.8065V17.0323H9.19355C9.35323 17.0323 9.48387 17.1629 9.48387 17.3226V18.6774Z'
      fill='#FDC904'
    />
    <defs>
      <filter
        id='filter0_d_92_786'
        x={-15}
        y={-21}
        width={131}
        height={78}
        filterUnits='userSpaceOnUse'
        colorInterpolationFilters='sRGB'
      >
        <feFlood floodOpacity={0} result='BackgroundImageFix' />
        <feColorMatrix
          in='SourceAlpha'
          type='matrix'
          values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
          result='hardAlpha'
        />
        <feOffset />
        <feGaussianBlur stdDeviation={10} />
        <feComposite in2='hardAlpha' operator='out' />
        <feColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 0.4 0 0 0 0 0 0 0 0 0.5 0' />
        <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_92_786' />
        <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_92_786' result='shape' />
      </filter>
      <linearGradient id='paint0_linear_92_786' x1={-1} y1={18} x2={76} y2={18} gradientUnits='userSpaceOnUse'>
        <stop stopColor='#FECF02' />
        <stop offset={1} stopColor='#FECF02' stopOpacity={0} />
      </linearGradient>
    </defs>
  </svg>
);

const Memo = memo(BalanceIcon);
export { Memo as BalanceIcon };
