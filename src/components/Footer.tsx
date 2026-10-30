"use client";
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from "react";
import Link from "next/link";
import { T } from "@/components/T";

export function Footer() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleLang = (lang: string) => {
    startTransition(() => router.replace(pathname.replace(`/${locale}`, `/${lang}`) || `/${lang}`));
  };

  return (
    <footer className="bg-foreground pt-24 pb-12 overflow-hidden text-background">
      <div className="container mx-auto px-6 lg:px-12 max-w-screen-xl">
        
        {/* Navegación y Selector de Idioma (Minimalista) */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-24 border-b border-white/10 pb-12">
          
          <nav>
            <ul className="flex flex-wrap gap-8 font-bold text-white/60 uppercase tracking-[0.2em] text-xs">
              <li><Link href={`/${locale}/`} className="hover:text-white transition-colors"><T>Inicio</T></Link></li>
              <li><Link href={`/${locale}/experiencias`} className="hover:text-white transition-colors"><T>Catálogo</T></Link></li>
              <li><Link href={`/${locale}/#contacto`} className="hover:text-white transition-colors"><T>Concierge</T></Link></li>
            </ul>
          </nav>

          {/* Selector de idioma como texto puro */}
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em]">
            <span className="text-white/30"><T>Idioma</T></span>
            <button 
              onClick={() => handleLang('es')} 
              className={`transition-colors ${locale === 'es' ? 'text-white border-b border-white pb-1' : 'text-white/50 hover:text-white'}`}
            >
              ES
            </button>
            <span className="text-white/30">/</span>
            <button 
              onClick={() => handleLang('en')} 
              className={`transition-colors ${locale === 'en' ? 'text-white border-b border-white pb-1' : 'text-white/50 hover:text-white'}`}
            >
              EN
            </button>
          </div>

        </div>

        {/* Branding Masivo "HorizonTrip" */}
        <div className="mb-24 flex justify-center w-full">
          <h2 className="text-5xl sm:text-[5rem] md:text-[7rem] lg:text-[9rem] leading-none font-black text-white tracking-tighter text-center">
            Horizon<span className="font-light italic text-primary">Trip.</span>
          </h2>
        </div>

        {/*  Meta información y Legales */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 text-xs font-medium text-white/50">
          
          <div className="space-y-4 max-w-sm">
            <p className="font-bold tracking-[0.2em] uppercase text-white/30"><T>Sede Central</T></p>
            <p className="leading-relaxed">
              Av. Río Mixcoac 44, San José Insurgentes, Benito Juárez, 03900 Ciudad de México, CDMX<br/>
              +52 1 55 5205 7362
            </p>
          </div>

          <div className="space-y-4 max-w-sm">
            <p className="font-bold tracking-[0.2em] uppercase text-white/30"><T>Métodos Asegurados</T></p>
            
            <div className="flex gap-2">
              <div className="flex h-8 items-center justify-center bg-white px-3 rounded-md">
                <svg
                  className="h-4"
                  viewBox="0 0 780 500"
                  fill="none"
                  aria-label="Visa"
                >
                  <rect
                    width="780"
                    height="500"
                    rx="40"
                    fill="white"
                  />
                  <path
                    fill="#1434CB"
                    d="M293.2 348.7l33.3-190.4h53.3l-33.3 190.4h-53.3zM500.8 163c-10.5-3.9-27-8.1-47.6-8.1-52.4 0-89.3 26.4-89.6 64.2-.3 28 26.5 43.6 46.7 52.9 20.7 9.5 27.7 15.6 27.6 24.1-.1 13-16.6 19-31.9 19-21.3 0-32.6-3-50.1-10.3l-6.9-3.1-7.5 43.8c12.4 5.4 35.5 10.1 59.4 10.4 55.7 0 91.9-26.1 92.3-66.5.2-22.2-14-39.1-44.6-53-18.6-9-30-15-29.9-24.1 0-8.1 9.6-16.7 30.5-16.7 17.4-.3 30 3.5 39.8 7.5l4.8 2.3 7.2-42.4h.8zM581.8 158.3h-41c-12.7 0-22.2 3.5-27.8 16.2l-78.8 178.2h55.7l11.1-29.1h68.1l6.5 29.1H624l-42.2-194.4zm-65.6 125.2c4.4-11.2 21.3-54.4 21.3-54.4-.3.5 4.4-11.4 7.1-18.7l3.6 16.9s10.2 46.6 12.4 56.2h-44.4z"
                  />
                  <path
                    fill="#1434CB"
                    d="M239.5 158.3L187.4 289l-5.5-26.8c-9.6-30.7-39.5-64-73-80.6l47.5 166.9h56l83.2-190.2h-56.1z"
                  />
                  <path
                    fill="#F7B600"
                    d="M146.9 158.3H61.3l-.6 3.5c66.4 16 110.3 54.7 128.5 101.2l-18.5-88.8c-3.2-12.1-12.5-15.5-23.8-15.9z"
                  />
                </svg>
              </div>

              <div className="flex h-8 items-center justify-center bg-white px-3 rounded-md">
                <svg
                  className="h-4"
                  viewBox="0 0 152 100"
                  fill="none"
                  aria-label="Mastercard"
                >
                  <rect
                    width="152"
                    height="100"
                    rx="8"
                    fill="white"
                  />
                  <circle
                    cx="55"
                    cy="50"
                    r="30"
                    fill="#EB001B"
                  />
                  <circle
                    cx="97"
                    cy="50"
                    r="30"
                    fill="#F79E1B"
                  />
                  <path
                    d="M76 27.5C82.6 32.8 87 40.8 87 50C87 59.2 82.6 67.2 76 72.5C69.4 67.2 65 59.2 65 50C65 40.8 69.4 32.8 76 27.5Z"
                    fill="#FF5F00"
                  />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 text-right items-start lg:items-end w-full lg:w-auto">
            <div className="flex gap-6 uppercase tracking-widest font-bold">
              <Link href={`/${locale}/aviso-de-privacidad`} className="hover:text-white transition-colors"><T>Política y aviso integral de privacidad</T></Link>
              <Link href={`/${locale}/terminos-y-condiciones`} className="hover:text-white transition-colors"><T>Términos y condiciones generales de contratación</T></Link>
              <Link href={`/${locale}/politica-de-cancelacion`} className="hover:text-white transition-colors"><T>Política de cancelaciones</T></Link>
            </div>
            <p>
              © {new Date().getFullYear()} HorizonTrip. <T>Todos los derechos reservados.</T>
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
}
