import { memo, SVGProps } from 'react';

const EscaperoomIconIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 22 25' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M20.6147 5.3689L12.5103 0.443115C11.5381 -0.147705 10.3364 -0.147705 9.36426 0.443115L1.26025 5.3689C1.00049 5.52661 1.00195 5.91919 1.26318 6.07495L10.9375 11.8435L20.6123 6.07495C20.8735 5.91919 20.875 5.5271 20.6147 5.3689ZM21.2905 7.5481L11.7188 13.2551V24.1838C11.7188 24.8127 12.3726 25.2048 12.8931 24.8884L20.3228 20.3728C21.2837 19.7888 21.875 18.7156 21.875 17.5554V7.9021C21.875 7.58911 21.5508 7.39282 21.2905 7.5481ZM0 7.9021V17.5554C0 18.7161 0.591309 19.7888 1.55225 20.3728L8.98193 24.8879C9.50293 25.2043 10.1562 24.8127 10.1562 24.1834V13.2551L0.584473 7.5481C0.324219 7.39282 0 7.58911 0 7.9021Z'
      fill='black'
      fillOpacity={0.85}
    />
  </svg>
);

const Memo = memo(EscaperoomIconIcon);
export { Memo as EscaperoomIconIcon };
