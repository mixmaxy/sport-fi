import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

/**
 * Footer Component
 * 
 * Why:
 * - Provides site structure and navigation
 * - Social media links
 * - Contact information
 * - Copyright notice
 * 
 * SEO Benefits:
 * - <footer> semantic element
 * - Internal linking structure
 * - Contact information helps local SEO
 * - Social media presence signals
 */

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Aktivitas Olahraga', href: '/activities' },
      { label: 'Kategori', href: '/categories' },
      { label: 'Cara Pesan', href: '/how-to-book' },
    ],
    company: [
      { label: 'Tentang Kami', href: '/about' },
      { label: 'Kontak', href: '/contact' },
      { label: 'Karir', href: '/careers' },
    ],
    legal: [
      { label: 'Syarat & Ketentuan', href: '/terms' },
      { label: 'Kebijakan Privasi', href: '/privacy' },
      { label: 'FAQ', href: '/faq' },
    ],
  };

  const socialLinks = [
    { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
    { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
    { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 text-white text-xl font-bold mb-4">
              <span className="text-2xl" aria-hidden="true">🏃</span>
              SportReserve
            </Link>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              Platform reservasi olahraga terpercaya untuk menemukan dan memesan
              berbagai aktivitas olahraga di seluruh Indonesia.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <address className="not-italic">
                  Jl. Sudirman No. 123<br />
                  Jakarta Pusat, DKI Jakarta 10220
                </address>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="tel:+622112345678" className="hover:text-white transition-colors">
                  +62 21 1234 5678
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@sportreserve.com" className="hover:text-white transition-colors">
                  info@sportreserve.com
                </a>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produk</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Perusahaan</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              &copy; {currentYear} SportReserve. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};