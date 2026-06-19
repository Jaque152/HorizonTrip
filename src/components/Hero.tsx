// Hero.tsx
"use client";
import { T } from "@/components/T";
import { MapPin, MoveDown } from "lucide-react";
import { useLocale } from 'next-intl';

export function Hero() {
  const locale = useLocale();
  
  return (
    <section className="relative h-screen w-full flex flex-col justify-end pb-12 md:pb-20 px-6 lg:px-12 overflow-hidden">
      
      {/* Fondo Cinemático Inmersivo */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="https://images.pexels.com/photos/240526/pexels-photo-240526.jpeg" 
          alt="Paisaje de selva y playa" 
          className="w-full h-full object-cover animate-pulse-slow scale-105"
          style={{ animation: 'panImage 30s infinite alternate ease-in-out' }}
        />
        {/* OVERLAYS DE CONTRASTE: Fundamentales para que el texto blanco sea legible */}
        {/* 1. Oscurecimiento general sutil */}
        <div className="absolute inset-0 bg-black/30" />
        {/* 2. Degradado fuerte abajo para fundir con la página y arriba para el Navbar */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-background" />
      </div>

      <style jsx>{`
        @keyframes panImage {
          0% { transform: scale(1.05) translate(0, 0); }
          100% { transform: scale(1.1) translate(-1%, 2%); }
        }
      `}</style>

      {/* Contenido Principal */}
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto flex flex-col md:flex-row items-end justify-between gap-12 animate-reveal pt-32">
        
        {/* Lado Izquierdo: Narrativa */}
        <div className="w-full md:w-2/3">
          <div className="mb-6 inline-flex items-center gap-3">
            <span className="h-[1px] w-8 bg-primary"></span>
            <span className="text-xs md:text-sm font-bold text-white tracking-[0.4em] uppercase drop-shadow-md">
              <T>Retiros Exclusivos</T>
            </span>
          </div>
          
          {/* Texto en blanco brillante para contraste puro */}
          <h1 className="text-white text-6xl sm:text-8xl lg:text-[10rem] xl:text-[11rem] font-black leading-[0.85] tracking-tighter drop-shadow-xl">
            Horizon<br/>
            <span className="text-primary font-light italic tracking-tight">Trip.</span>
          </h1>
          
          <p className="mt-8 text-base sm:text-lg lg:text-xl text-white/90 font-medium max-w-lg leading-relaxed drop-shadow-md">
            <T>El arte de viajar sin la fricción del turismo masivo. Santuarios naturales, costas inexploradas y tiempo para reconectar.</T>
          </p>
        </div>

        {/* Lado Derecho: Widget de Destino */}
        <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-8">
          
          {/* Tarjeta Glassmorphism mejorada (Fondo oscuro semitransparente) */}
          <div className="p-5 rounded-3xl w-full sm:w-80 bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl">
            <p className="text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 text-white/70">
              <T>Destino Destacado</T>
            </p>
            <div className="flex gap-4 items-center group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                <img 
                  src="https://images.pexels.com/photos/1640413/pexels-photo-1640413.jpeg" 
                  alt="Tulum" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <div>
                <p className="font-black text-white text-lg leading-tight group-hover:text-primary transition-colors">Costa Esmeralda</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-white/80 font-medium">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span>Oaxaca, México</span>
                </div>
              </div>
            </div>
          </div>

          {/* Indicador de Scroll Orgánico */}
          <div className="flex items-center gap-4 text-white/70 md:justify-end w-full cursor-pointer hover:text-white transition-colors mt-4">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest"><T>Descubre</T></span>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center animate-bounce shadow-lg">
              <MoveDown className="w-4 h-4" />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}