import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-outline-variant bg-surface-container-lowest"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 sm:px-6 md:h-24 md:flex-row md:gap-8 lg:px-10">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-on-surface transition-colors hover:text-primary"
        >
          Sport Reserve
        </Link>

        <nav
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-8"
          aria-label="Footer"
        >
          <a
            href="#"
            className="text-xs font-semibold text-on-surface-variant underline decoration-2 underline-offset-4 transition-opacity hover:text-primary"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-xs font-semibold text-on-surface-variant underline decoration-2 underline-offset-4 transition-opacity hover:text-primary"
          >
            Terms of Service
          </a>
          <a
            href="mailto:info@sportreserve.com"
            className="text-xs font-semibold text-on-surface-variant underline decoration-2 underline-offset-4 transition-opacity hover:text-primary"
          >
            Contact Us
          </a>
        </nav>

        <p className="text-center text-sm text-on-surface-variant md:text-right">
          &copy; {currentYear} Sport Reserve. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
