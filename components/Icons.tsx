import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(props: IconProps) {
  const { size = 20, ...rest } = props;
  return { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, ...rest };
}

export function WalletIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M16 13h2" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function ScanIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
    </svg>
  );
}

export function HistoryIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
    </svg>
  );
}

export function PiggyBankIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 13a6 6 0 0 1 6-6h4a6 6 0 0 1 6 3h1v4h-2" />
      <path d="M4 13v3a2 2 0 0 0 2 2h1v2" />
      <path d="M15 18v2" />
      <circle cx="15" cy="10" r="0.6" fill="currentColor" />
      <path d="M8 7V5" />
    </svg>
  );
}

export function ChartPieIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21.2 15.3A10 10 0 1 1 12 2v10l9.2 3.3Z" />
    </svg>
  );
}

export function ReceiptIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 2h12v19l-3-2-3 2-3-2-3 2V2Z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.3 2.3L16 9.5" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 8a2 2 0 0 1 2-2h1.2l.9-1.5A2 2 0 0 1 9.8 3.5h4.4a2 2 0 0 1 1.7 1L17 6h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
      <circle cx="12" cy="13" r="3.3" />
    </svg>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 12 6 8Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M4 21h16" />
    </svg>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 4 6v6c0 4.5 3.2 7.7 8 9 4.8-1.3 8-4.5 8-9V6l-8-3Z" />
    </svg>
  );
}

export function UtensilsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 2v7a2 2 0 0 0 4 0V2M8 9v13" />
      <path d="M16 2c-1.5 0-2.5 1.8-2.5 4s1 4 2.5 4v11" />
    </svg>
  );
}

export function CarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 13h18l-1.5-5a2 2 0 0 0-1.9-1.4H6.4A2 2 0 0 0 4.5 8L3 13Z" />
      <path d="M3 13v4a1 1 0 0 0 1 1h1M21 13v4a1 1 0 0 1-1 1h-1" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
}

export function CookieIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3a9 9 0 1 0 9 9c-2 0-3-1-3-2.5S17 7 15.5 7 13 6 13 4.5C13 3.6 12.6 3 12 3Z" />
      <circle cx="8.5" cy="12.5" r="0.6" fill="currentColor" />
      <circle cx="11.5" cy="16.5" r="0.6" fill="currentColor" />
      <circle cx="15" cy="14" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function FilmIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M3 9h18M3 15h18M8 4v4M8 16v4M16 4v4M16 16v4" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 8h12l1 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function BoxIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 8 12 3 3 8l9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8M12 13v8" />
    </svg>
  );
}
