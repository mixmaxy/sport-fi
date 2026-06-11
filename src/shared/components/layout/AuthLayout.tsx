import Image from "next/image";
import Link from "next/link";

const authHeroImage =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1920&q=80";
interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <section className="relative hidden overflow-hidden lg:flex lg:w-1/2 xl:w-7/12">
        <Image
          src={authHeroImage}
          alt="Lapangan olahraga"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary/60 to-inverse-surface/80" />
        <div className="relative z-10 flex flex-col justify-center px-10 text-white xl:px-16">
          <Link
            href="/"
            className="mb-6 text-2xl font-black tracking-tight italic"
          >
            Sport Reserve
          </Link>
          <h1 className="mb-6 max-w-xl text-4xl font-extrabold tracking-tight xl:text-5xl">
            Elevate Your Game. Reserve Your Arena.
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-white/90">
            Access premium sports facilities. From neighborhood courts to
            professional venues — book your spot in seconds.
          </p>
          <div className="mt-12 flex gap-8">
            <div>
              <div className="text-2xl font-black">500+</div>
              <div className="text-xs uppercase tracking-widest opacity-75">
                Venues
              </div>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <div className="text-2xl font-black">24/7</div>
              <div className="text-xs uppercase tracking-widest opacity-75">
                Booking
              </div>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <div className="text-2xl font-black">50k+</div>
              <div className="text-xs uppercase tracking-widest opacity-75">
                Athletes
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex w-full max-h-screen flex-col justify-center overflow-y-auto bg-background px-4 py-12 sm:px-8 lg:max-h-none lg:w-1/2 xl:w-5/12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="text-xl font-extrabold text-primary">
              Sport Reserve
            </Link>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface">{title}</h2>
            <p className="mt-1 text-on-surface-variant">{subtitle}</p>
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
