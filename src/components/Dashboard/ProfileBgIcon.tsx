import { memo, SVGProps } from 'react';

const ProfileBgIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 46 46' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <circle cx={23} cy={23} r={23} fill='#171B27' stroke='#E0A301' strokeWidth={2} />
  </svg>
);

const Memo = memo(ProfileBgIcon);
export { Memo as ProfileBgIcon };
