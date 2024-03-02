import { memo, SVGProps } from 'react';

const Group13Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 434 422' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <g
      style={{
        mixBlendMode: 'color-dodge',
      }}
      opacity={0.8}
    >
      <g
        style={{
          mixBlendMode: 'color-dodge',
        }}
        filter='url(#filter0_f_40_8586)'
      >
        <ellipse
          cx={15.9561}
          cy={88.9976}
          rx={15.9561}
          ry={88.9976}
          transform='matrix(0.51055 0.859848 -0.87199 0.489524 397.611 92.3842)'
          fill='url(#paint0_radial_40_8586)'
        />
        <ellipse
          cx={15.9561}
          cy={88.9976}
          rx={15.9561}
          ry={88.9976}
          transform='matrix(0.51055 0.859848 -0.87199 0.489524 171.851 219.123)'
          fill='url(#paint1_radial_40_8586)'
        />
      </g>
      <g filter='url(#filter1_f_40_8586)'>
        <path
          d='M296.428 77.2314L268.13 129.273C248.855 164.721 273.628 207.296 314.388 208.773L375.855 211L316.33 213.156C275.076 214.651 249.29 258.079 268.586 293.565L296.428 344.769L263.711 294.122C242.015 260.537 191.709 260.964 169.774 294.919L137.572 344.769L165.87 292.727C185.145 257.279 160.372 214.704 119.612 213.227L58.145 211L117.67 208.843C158.924 207.349 184.71 163.921 165.414 128.434L137.572 77.2314L170.289 127.878C191.985 161.463 242.291 161.036 264.226 127.081L296.428 77.2314Z'
          fill='#FF784E'
        />
      </g>
    </g>
    <defs>
      <filter
        id='filter0_f_40_8586'
        x={-15.6453}
        y={63.9826}
        width={461.835}
        height={298.114}
        filterUnits='userSpaceOnUse'
        colorInterpolationFilters='sRGB'
      >
        <feFlood floodOpacity={0} result='BackgroundImageFix' />
        <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
        <feGaussianBlur stdDeviation={20} result='effect1_foregroundBlur_40_8586' />
      </filter>
      <filter
        id='filter1_f_40_8586'
        x={38.145}
        y={57.2314}
        width={357.71}
        height={307.537}
        filterUnits='userSpaceOnUse'
        colorInterpolationFilters='sRGB'
      >
        <feFlood floodOpacity={0} result='BackgroundImageFix' />
        <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
        <feGaussianBlur stdDeviation={10} result='effect1_foregroundBlur_40_8586' />
      </filter>
      <radialGradient
        id='paint0_radial_40_8586'
        cx={0}
        cy={0}
        r={1}
        gradientUnits='userSpaceOnUse'
        gradientTransform='translate(15.9561 88.9976) rotate(90) scale(88.9976 15.9561)'
      >
        <stop stopColor='#FFD028' />
        <stop offset={1} stopColor='#FFD028' stopOpacity={0} />
      </radialGradient>
      <radialGradient
        id='paint1_radial_40_8586'
        cx={0}
        cy={0}
        r={1}
        gradientUnits='userSpaceOnUse'
        gradientTransform='translate(15.9561 88.9976) rotate(90) scale(88.9976 15.9561)'
      >
        <stop stopColor='#FFD028' />
        <stop offset={1} stopColor='#FFD028' stopOpacity={0} />
      </radialGradient>
    </defs>
  </svg>
);

const Memo = memo(Group13Icon);
export { Memo as Group13Icon };
