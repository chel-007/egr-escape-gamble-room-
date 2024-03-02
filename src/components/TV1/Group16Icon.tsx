import { memo, SVGProps } from 'react';

const Group16Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 420 86' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <rect x={10.7889} y={38.3853} width={398.422} height={0.770642} fill='url(#paint0_linear_40_8132)' />
    <g filter='url(#filter0_f_40_8132)'>
      <rect x={6.16516} y={37.6147} width={407.67} height={2.31193} fill='url(#paint1_linear_40_8132)' />
    </g>
    <g
      style={{
        mixBlendMode: 'color-dodge',
      }}
      filter='url(#filter1_f_40_8132)'
    >
      <path
        d='M0 38.7706C0 38.1297 0.51497 37.6077 1.15586 37.599L210 34.7615L418.844 37.599C419.485 37.6077 420 38.1297 420 38.7706V38.7706C420 39.4116 419.485 39.9336 418.844 39.9423L210 42.7798L1.15586 39.9423C0.514968 39.9336 0 39.4116 0 38.7706V38.7706Z'
        fill='url(#paint2_linear_40_8132)'
      />
    </g>
    <g
      style={{
        mixBlendMode: 'color-dodge',
      }}
    >
      <ellipse cx={209.862} cy={42.7706} rx={92.8624} ry={42.7706} fill='url(#paint3_radial_40_8132)' />
    </g>
    <defs>
      <filter
        id='filter0_f_40_8132'
        x={1.16516}
        y={32.6147}
        width={417.67}
        height={12.3119}
        filterUnits='userSpaceOnUse'
        colorInterpolationFilters='sRGB'
      >
        <feFlood floodOpacity={0} result='BackgroundImageFix' />
        <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
        <feGaussianBlur stdDeviation={2.5} result='effect1_foregroundBlur_40_8132' />
      </filter>
      <filter
        id='filter1_f_40_8132'
        x={-11}
        y={23.7615}
        width={442}
        height={30.0183}
        filterUnits='userSpaceOnUse'
        colorInterpolationFilters='sRGB'
      >
        <feFlood floodOpacity={0} result='BackgroundImageFix' />
        <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
        <feGaussianBlur stdDeviation={5.5} result='effect1_foregroundBlur_40_8132' />
      </filter>
      <linearGradient
        id='paint0_linear_40_8132'
        x1={409.211}
        y1={39.1588}
        x2={10.7889}
        y2={39.1588}
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='white' stopOpacity={0.08} />
        <stop offset={0.5} stopColor='white' />
        <stop offset={1} stopColor='white' stopOpacity={0.08} />
      </linearGradient>
      <linearGradient
        id='paint1_linear_40_8132'
        x1={6.16516}
        y1={39.9265}
        x2={413.835}
        y2={39.9265}
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#F03737' />
        <stop offset={0.25} stopColor='#BC68FE' />
        <stop offset={0.505} stopColor='#F44C17' />
        <stop offset={0.75} stopColor='#EC58CB' />
        <stop offset={1} stopColor='#ECE432' />
      </linearGradient>
      <linearGradient
        id='paint2_linear_40_8132'
        x1={0}
        y1={42.7793}
        x2={420}
        y2={42.7793}
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#F03737' />
        <stop offset={0.25} stopColor='#BC68FE' />
        <stop offset={0.505} stopColor='#F44C17' />
        <stop offset={0.75} stopColor='#EC58CB' />
        <stop offset={1} stopColor='#ECE432' />
      </linearGradient>
      <radialGradient
        id='paint3_radial_40_8132'
        cx={0}
        cy={0}
        r={1}
        gradientUnits='userSpaceOnUse'
        gradientTransform='translate(210 43) rotate(90) scale(43 117)'
      >
        <stop stopColor='#D9D9D9' />
        <stop offset={1} stopOpacity={0} />
      </radialGradient>
    </defs>
  </svg>
);

const Memo = memo(Group16Icon);
export { Memo as Group16Icon };
