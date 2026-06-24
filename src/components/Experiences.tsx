"use client";
import { useLocale } from 'next-intl';
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/T";

// Reestructuramos el array para que coincida con la BD (Plan, Experiencia, Personalizada)
const categoryCards = [
  {
    id: 1,
    number: "01",
    title: "Planes Locales",
    description: "Recorridos gastronómicos y culturales de medio día en los rincones urbanos más vibrantes.",
    image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg", 
    tag: "Descubrimiento",
    slug: "plan" // Coincide con la BD
  },
  {
    id: 2,
    number: "02",
    title: "Experiencias Premium",
    description: "Inmersión total. Accesos exclusivos a cenotes privados, beach clubs y menús de alta cocina.",
    image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg", 
    tag: "High-End",
    slug: "experiencia" // Coincide con la BD
  },
  {
    id: 3,
    number: "03",
    title: "Rutas a la Medida",
    description: "Itinerarios 100% privados curados por nuestro equipo, adaptados a tus propios tiempos.",
    image: "https://images.pexels.com/photos/331107/pexels-photo-331107.jpeg", 
    tag: "Personalizado",
    slug: "personalizada" // Coincide con la BD
  }
];

export function Experiences() {
  const locale = useLocale();
  return (
    <section id="experiencias" className="py-24 lg:py-32 bg-white relative">
      <div className="container mx-auto px-6 lg:px-12 max-w-screen-xl">
        
        {/* Cabecera Editorial */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-3">
              <span className="h-[1px] w-8 bg-primary"></span>
              <span className="text-xs font-bold text-foreground/50 tracking-[0.4em] uppercase">
                <T>Líneas de Viaje</T>
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-foreground leading-[1.1] tracking-tighter">
              <T>Colección</T> <span className="font-light italic text-primary"><T>Horizon.</T></span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium max-w-md">
              <T>Desde escapes culinarios de unas horas hasta inmersiones totales en el Caribe. Tú decides la intensidad.</T>
            </p>
          </div>
          <Link href={`/${locale}/experiencias`} className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all uppercase tracking-widest text-xs">
            <T>Ver todas las rutas</T> <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid de 3 Columnas Estilo Revista */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {categoryCards.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}/experiencias?categoria=${cat.slug}`}
              className="group block h-[450px] lg:h-[600px]"
            >
              <Card className="h-full relative overflow-hidden border-none rounded-3xl shadow-none hover:shadow-2xl transition-all duration-500">
                
                {/* Imagen de fondo */}
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradiente de oscurecimiento */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/90 transition-opacity group-hover:opacity-90" />

                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  {/* Top: Tag y Número */}
                  <div className="flex justify-between items-start">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest border border-white/20">
                      <T>{cat.tag}</T>
                    </span>
                    <span className="text-3xl font-serif italic text-white/50 group-hover:text-primary transition-colors">
                      {cat.number}
                    </span>
                  </div>

                  {/* Bottom: Título y Descripción */}
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-3xl font-black text-white mb-3 tracking-tight">
                      <T>{cat.title}</T>
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-0 group-hover:h-auto overflow-hidden font-medium">
                      <T>{cat.description}</T>
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}