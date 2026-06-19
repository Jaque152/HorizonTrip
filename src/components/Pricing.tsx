"use client";
import { useLocale } from 'next-intl';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/T";

export function Pricing() {
  const locale = useLocale();

  const benefits = [
    {
      title: "Cero paquetes prefabricados",
      description: "Diseño de ruta inteligente que se adapta exactamente al ritmo y los intereses que definas."
    },
    {
      title: "Arquitectura de presupuesto",
      description: "Tú defines el rango. Nosotros maximizamos cada centavo para garantizar el estándar Horizon."
    },
    {
      title: "Concierge Dedicado 24/7",
      description: "Un asesor experto monitoreando tu viaje en tiempo real, desde el despegue hasta el retorno."
    },
    {
      title: "Transparencia Total",
      description: "Sin tarifas ocultas ni sorpresas en el destino. Todo debidamente estructurado desde el día uno."
    }
  ];

  return (
    <section id="precios" className="py-24 lg:py-32 bg-background relative">
      <div className="container mx-auto px-6 lg:px-12 max-w-screen-xl">
        
        {/* Layout en Grid: Texto fijo a la izquierda, scroll de lista a la derecha */}
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Columna Izquierda: Sticky Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] text-foreground">
              <T>La Firma</T><br/>
              <span className="font-light italic text-primary"><T>HorizonTrip.</T></span>
            </h2>
            
            <p className="text-lg text-muted-foreground font-medium max-w-md leading-relaxed">
              <T>Elevamos el estándar. No vendemos boletos ni empaquetamos destinos; curamos y orquestamos cada aspecto de tu viaje para que tu única preocupación sea disfrutar.</T>
            </p>

            <Button asChild className="rounded-full bg-foreground text-background hover:bg-primary h-16 px-10 text-sm tracking-widest uppercase font-bold transition-all shadow-xl group w-full sm:w-auto">
              <Link href={`/${locale}/cotizar`}>
                <T>Iniciar Diseño de Ruta</T>
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Columna Derecha: Lista Desnuda (Sin Tarjetas) */}
          <div className="lg:col-span-7 flex flex-col">
            {benefits.map((item, i) => (
              <div 
                key={i} 
                className="group border-t border-foreground/10 py-10 flex flex-col sm:flex-row gap-6 sm:gap-12 items-start hover:border-primary transition-colors"
              >
                {/* Número Tipográfico Gigante */}
                <span className="text-5xl font-serif text-foreground/10 group-hover:text-primary transition-colors leading-none">
                  0{i + 1}
                </span>
                
                {/* Contenido */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-foreground tracking-tight">
                    <T>{item.title}</T>
                  </h3>
                  <p className="text-muted-foreground font-medium leading-relaxed max-w-md">
                    <T>{item.description}</T>
                  </p>
                </div>
              </div>
            ))}
            {/* Cierre visual inferior */}
            <div className="border-t border-foreground/10" />
          </div>

        </div>
      </div>
    </section>
  );
}