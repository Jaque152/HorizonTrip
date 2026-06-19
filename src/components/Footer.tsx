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
        
        {/* Nivel 1: Navegación y Selector de Idioma (Minimalista) */}
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

        {/* Nivel 2: Branding Masivo "HorizonTrip" */}
        <div className="mb-24 flex justify-center w-full">
          <h2 className="text-5xl sm:text-[5rem] md:text-[7rem] lg:text-[9rem] leading-none font-black text-white tracking-tighter text-center">
            Horizon<span className="font-light italic text-primary">Trip.</span>
          </h2>
        </div>

        {/* Nivel 3: Meta información y Legales (Sin iconos saturados) */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 text-xs font-medium text-white/50">
          
          <div className="space-y-4 max-w-sm">
            <p className="font-bold tracking-[0.2em] uppercase text-white/30"><T>Sede Central</T></p>
            <p className="leading-relaxed">
              Ciudad de México, MX<br/>
              Redefiniendo la forma en la que el mundo explora el corazón de México.
            </p>
          </div>

          <div className="space-y-4 max-w-sm">
            <p className="font-bold tracking-[0.2em] uppercase text-white/30"><T>Métodos Asegurados</T></p>
            <p className="leading-relaxed">
              Visa, Mastercard, American Express.<br/>
              Transacciones encriptadas de extremo a extremo.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 text-right items-start lg:items-end w-full lg:w-auto">
            <div className="flex gap-6 uppercase tracking-widest font-bold">
              <Link href={`/${locale}/aviso-de-privacidad`} className="hover:text-white transition-colors"><T>Privacidad</T></Link>
              <Link href={`/${locale}/terminos-y-condiciones`} className="hover:text-white transition-colors"><T>Términos</T></Link>
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