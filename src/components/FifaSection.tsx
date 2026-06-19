"use client";
import { useLocale } from 'next-intl';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { FifaExp } from "@/lib/types";
import { T } from "@/components/T";

export function FifaSection() {
  const [fifaExps, setFifaExps] = useState<FifaExp[]>([]);
  const [activeExpId, setActiveExpId] = useState<number | null>(null);
  const locale = useLocale();

  useEffect(() => {
    async function loadFifaData() {
      // CAMBIO CLAVE: Apuntamos a la nueva tabla terminada en _horizon
      const { data, error } = await supabase
        .from('fifa_experiences_horizon')
        .select('*')
        .order('order_index', { ascending: true });
        
      if (error) {
        console.error("Error al cargar experiencias FIFA:", error);
      }

      if (data) {
        setFifaExps(data);
        if (data.length > 0) {
          setActiveExpId(data[0].id); 
        }
      }
    }
    loadFifaData();
  }, []);

  const activeExp = fifaExps.find(exp => exp.id === activeExpId);

  return (
    <section className="relative min-h-screen flex items-center py-24 lg:py-32 bg-foreground text-white overflow-hidden">
      
      {/* Fondo Dinámico Inmersivo - Cambia según la experiencia activa */}
      {fifaExps.map((exp) => (
        <div 
          key={exp.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeExpId === exp.id ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
        >
          <img 
            src={exp.image_url} 
            alt={exp.title} 
            className="w-full h-full object-cover scale-105"
          />
          {/* Degradado que oscurece la mitad izquierda para que el texto sea legible */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-transparent md:to-black/30" />
        </div>
      ))}

      <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full">
        
        <div className="max-w-3xl mb-16">
          <div className="mb-6 inline-flex items-center gap-3">
            <Trophy className="w-4 h-4 text-secondary" />
            <span className="text-xs font-bold text-secondary tracking-[0.3em] uppercase drop-shadow-md">
              <T>Exclusividad Deportiva</T>
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-[0.9]">
            <T>El mundo mira.</T><br/>
            <span className="font-light italic text-white/50">
              <T>Tú lo vives.</T>
            </span>
          </h2>
        </div>

        {/* Layout Radicalmente Distinto: Navegación Horizontal */}
        {fifaExps.length > 0 && activeExp && (
          <div className="flex flex-col gap-12">
            
            {/* Menú de Pestañas Minimalista */}
            <div className="flex flex-wrap gap-4 md:gap-8 border-b border-white/20 pb-4">
              {fifaExps.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveExpId(exp.id)}
                  className={`text-sm md:text-base font-bold tracking-widest uppercase transition-all duration-300 relative pb-4 ${
                    activeExpId === exp.id 
                      ? 'text-white' 
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  <T>{exp.title}</T>
                  {/* Línea indicadora animada */}
                  {activeExpId === exp.id && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-secondary animate-reveal" />
                  )}
                </button>
              ))}
            </div>

            {/* Contenido de la Experiencia Activa (Sin Cajas ni Tarjetas) */}
            <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl animate-reveal" key={activeExp.id}>
              
              <div className="space-y-8">
                <h3 className="text-3xl font-black text-secondary tracking-tight">
                  <T>{activeExp.subtitle}</T>
                </h3>
                <p className="text-lg text-white/80 leading-relaxed font-medium">
                  <T>{activeExp.description}</T>
                </p>
                <Button asChild className="rounded-none border-b-2 border-secondary bg-transparent hover:bg-secondary hover:text-foreground text-white h-14 px-8 text-sm tracking-widest uppercase font-bold transition-all mt-4">
                  <Link href={`/${locale}/cotizar`}>
                    <T>Reservar Acceso</T> <ArrowRight className="ml-3 w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* Lista de beneficios con tipografía gigante */}
              <div className="flex flex-col gap-6">
                {activeExp.items.map((item, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <span className="text-2xl font-serif italic text-white/20 group-hover:text-secondary transition-colors">
                      0{i + 1}
                    </span>
                    <span className="text-base text-white/90 font-medium leading-snug pt-1 border-b border-white/10 pb-4 w-full">
                      <T>{item}</T>
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}