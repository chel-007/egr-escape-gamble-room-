import { memo, SVGProps } from 'react';

interface LeaderboardsIconProps extends SVGProps<SVGSVGElement> {
  activeFill: string;
  inactiveFill: string;
  isActive: boolean;
}

const LeaderboardsIcon = ({ activeFill, inactiveFill, isActive, ...props }: LeaderboardsIconProps) => (
  <svg preserveAspectRatio='none' viewBox='0 0 15 14' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M14.375 1.66667H11.6667V0.625C11.6667 0.278646 11.388 0 11.0417 0H3.95833C3.61198 0 3.33333 0.278646 3.33333 0.625V1.66667H0.625C0.278646 1.66667 0 1.94531 0 2.29167V3.75C0 4.67969 0.585938 5.63542 1.61198 6.3724C2.43229 6.96354 3.42969 7.33854 4.47656 7.45833C5.29427 8.8151 6.25 9.375 6.25 9.375V11.25H5C4.08073 11.25 3.33333 11.7891 3.33333 12.7083V13.0208C3.33333 13.1927 3.47396 13.3333 3.64583 13.3333H11.3542C11.526 13.3333 11.6667 13.1927 11.6667 13.0208V12.7083C11.6667 11.7891 10.9193 11.25 10 11.25H8.75V9.375C8.75 9.375 9.70573 8.8151 10.5234 7.45833C11.5729 7.33854 12.5703 6.96354 13.388 6.3724C14.4115 5.63542 15 4.67969 15 3.75V2.29167C15 1.94531 14.7214 1.66667 14.375 1.66667ZM2.58594 5.02083C1.95052 4.5625 1.66667 4.05208 1.66667 3.75V3.33333H3.33854C3.36458 4.18229 3.48958 4.92708 3.67188 5.57812C3.27865 5.44271 2.91146 5.25521 2.58594 5.02083ZM13.3333 3.75C13.3333 4.16927 12.8724 4.6901 12.4141 5.02083C12.0885 5.25521 11.7188 5.44271 11.3255 5.57812C11.5078 4.92708 11.6328 4.18229 11.6589 3.33333H13.3333V3.75Z'
      fill={isActive ? activeFill : inactiveFill}
    />
  </svg>
);

const Memo = memo(LeaderboardsIcon);
export { Memo as LeaderboardsIcon };
