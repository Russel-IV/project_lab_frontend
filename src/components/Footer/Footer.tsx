import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  { label: 'How pay-later works', to: '/pay-later' },
  { label: 'Booking Terms', to: '/booking-terms' },
  { label: 'Terms of Service', to: '/terms-of-service' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-[#121529] w-full shadow-[inset_0_6px_15px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center gap-3 py-8"
      aria-label="Main Footer"
    >
      <span className="text-3xl font-bold tracking-tight select-none">
        <span className="bg-gradient-to-r from-frui-orange to-[#ff9900] bg-clip-text text-transparent">
          Frui
        </span>
      </span>

      <nav
        aria-label="Footer"
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-4"
      >
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-xs font-medium text-frui-white/70 hover:text-frui-white hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <p className="text-sm text-frui-white/60">
        &copy; {year} Frui. All rights reserved.
      </p>
    </footer>
  );
}
