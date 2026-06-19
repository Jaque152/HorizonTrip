"use client";

import { useLocale } from 'next-intl';
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { T } from "@/components/T";
import { ArrowRight, Compass, Sparkles, MapPin, Feather, Target, Layers, LayoutList } from "lucide-react";

export default function SobreNosotrosPage() {
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Header />
      
      <main className="flex-1">
        
        {/* 1. HERO & ESENCIA (Basado en la imagen 1 - Ruta Vibes) */}
        <section className="pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3">
                <span className="h-[1px] w-8 bg-primary"></span>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/60">
                  <T>Nuestra Firma</T>
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.9]">
                <T>Diseñamos viajes</T><br/>
                <span className="font-light italic text-primary"><T>con intención.</T></span>
              </h1>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-md">
                <T>Cada expedición nace de una visión pura: celebrar, asombrar, desconectar o conquistar un destino con absoluta exclusividad. Orquestamos rutas donde la inmersión, la alta gastronomía y la logística se fusionan a la medida.</T>
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-foreground/10">
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2"><T>El Enfoque</T></p>
                  <p className="text-sm font-black text-foreground"><T>Destino, narrativa y ejecución impecable en una misma pieza.</T></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2"><T>El Objetivo</T></p>
                  <p className="text-sm font-black text-foreground"><T>Que cada travesía respire al ritmo exacto de quien la protagoniza.</T></p>
                </div>
              </div>
            </div>

            {/* Imagen Asimétrica */}
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl group">
              <img 
                src="https://images.pexels.com/photos/3280130/pexels-photo-3280130.jpeg" 
                alt="Filosofía HorizonTrip" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="glass-panel p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <p className="text-white font-black text-xl mb-1">HorizonTrip</p>
                  <p className="text-white/80 text-xs font-medium uppercase tracking-widest"><T>Reimaginando la exploración en México.</T></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ENFOQUE Y BASES (Basado en la imagen 2 - Tres bases de la experiencia) */}
        <section className="py-24 bg-foreground text-background relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <div className="container mx-auto px-6 lg:px-12 max-w-screen-xl relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter"><T>Tres pilares de la experiencia</T></h2>
              <p className="text-background/60 font-medium text-lg"><T>Así materializamos el estándar HorizonTrip en expediciones nítidas, fluidas y absolutamente personalizables.</T></p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  icon: Target,
                  title: "Diseño con Intención",
                  desc: "No hay rutas al azar. Cada itinerario se esculpe para celebrar, asombrar o desconectar en sintonía con tu visión específica."
                },
                {
                  icon: MapPin,
                  title: "El Destino como Lienzo",
                  desc: "Rechazamos los genéricos. Sincronizamos tu viaje con la selva, la costa o la herencia cultural para que el entorno cobre vida."
                },
                {
                  icon: Layers,
                  title: "Logística Invisible",
                  desc: "Fechas, traslados, accesos y hospitalidad se orquestan milimétricamente desde el primer día para garantizar cero contratiempos."
                }
              ].map((pillar, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 transition-colors group">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-8 group-hover:-translate-y-2 transition-transform">
                    <pillar.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight"><T>{pillar.title}</T></h3>
                  <p className="text-white/60 leading-relaxed font-medium"><T>{pillar.desc}</T></p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. EXPERIENCIAS COMPLETAS (Basado en la imagen 3 - Por qué Ruta Vibes) */}
        <section className="py-24 lg:py-32 bg-background border-b border-foreground/10">
          <div className="container mx-auto px-6 lg:px-12 max-w-screen-xl">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-[1.1]">
                  <T>Orquestamos experiencias</T> <span className="font-light italic text-primary"><T>completas.</T></span>
                </h2>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                  <T>HorizonTrip integra accesos privados, alta cocina, fotografía, sorpresas a medida y traslados blindados. El plan base de nuestro catálogo es solo el preludio, no la frontera.</T>
                </p>

                <div className="space-y-8 pt-8">
                  {[
                    { title: "Diseño Emocional", desc: "Calculamos el ritmo, la atmósfera y el impacto de cada paso para forjar recuerdos imborrables, no solo itinerarios logísticos." },
                    { title: "Concierge Dedicado", desc: "Viajero, destino y anfitriones convergen bajo una misma batuta humana para que la travesía fluida de principio a fin." },
                    { title: "Curaduría Estética", desc: "Cada santuario, encuadre y detalle se selecciona bajo un criterio riguroso de belleza visual y exclusividad." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 items-start group">
                      <div className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center shrink-0 group-hover:border-primary transition-colors">
                        <span className="font-serif italic text-foreground/40 group-hover:text-primary">0{i+1}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-foreground mb-2"><T>{item.title}</T></h4>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed"><T>{item.desc}</T></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="aspect-video rounded-[2rem] overflow-hidden shadow-xl mb-8">
                  <img src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg" alt="Resort de lujo" className="w-full h-full object-cover" />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-[2rem] border border-foreground/10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4"><T>Disciplinas Creativas</T></p>
                    <ul className="space-y-3">
                      {["Retiros Privados", "Alta Gastronomía", "Hospitalidad VIP", "Escapadas a Medida", "Sorpresas Exclusivas"].map((area, i) => (
                        <li key={i} className="text-sm font-bold text-foreground/80 flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full" /> <T>{area}</T>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-foreground p-8 rounded-[2rem] shadow-xl text-background">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4"><T>Cobertura</T></p>
                    <h4 className="text-2xl font-black mb-3"><T>México</T></h4>
                    <p className="text-background/70 text-sm font-medium leading-relaxed"><T>Caribe, Bajío, Costas del Pacífico y Pueblos Mágicos seleccionados bajo estricto estándar de calidad.</T></p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. OPERACIÓN / METODOLOGÍA (Basado en la imagen 4 - Operación) */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-6 lg:px-12 max-w-screen-xl">
            
            <div className="text-center max-w-2xl mx-auto mb-20">
              <div className="mb-4 inline-flex items-center justify-center">
                <Feather className="w-5 h-5 text-primary mr-3" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/60"><T>Metodología</T></span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-6"><T>De la idea a la reserva</T></h2>
              <p className="text-muted-foreground font-medium text-lg"><T>Este es el flujo exacto con el que convertimos una visión abstracta en un folio de expedición impecable e inmersivo.</T></p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 relative">
              {/* Línea conectora de fondo (visible solo en desktop) */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-foreground/10 -translate-y-1/2 z-0" />

              {[
                {
                  step: "01",
                  title: "Descubrimiento",
                  desc: "Mapeamos el motivo del viaje, tu estilo personal y la ciudad deseada para entender qué tipo de atmósfera cobra sentido para ti."
                },
                {
                  step: "02",
                  title: "Arquitectura de Ruta",
                  desc: "Seleccionamos el plan base, ajustamos servicios de élite y establecemos un ritmo de recorrido totalmente coherente con el destino."
                },
                {
                  step: "03",
                  title: "Consolidación",
                  desc: "La reserva queda sujeta a disponibilidad real, validando con transparencia los tiempos, el alcance logístico y los costos base."
                }
              ].map((phase, i) => (
                <div key={i} className="bg-white border border-foreground/10 rounded-[2rem] p-10 relative z-10 hover:border-primary transition-colors shadow-sm hover:shadow-xl group">
                  <span className="text-4xl font-serif italic text-foreground/20 group-hover:text-primary transition-colors block mb-6">{phase.step}</span>
                  <h3 className="text-2xl font-black text-foreground mb-4 tracking-tight"><T>{phase.title}</T></h3>
                  <p className="text-muted-foreground font-medium leading-relaxed"><T>{phase.desc}</T></p>
                </div>
              ))}
            </div>

            {/* CTA Final */}
            <div className="mt-24 text-center">
              <Link href={`/${locale}/cotizar`} className="inline-flex items-center justify-center h-16 px-10 rounded-full bg-foreground text-background font-bold tracking-widest uppercase hover:bg-primary transition-all shadow-xl group text-sm">
                <T>Iniciar Diseño de Ruta</T>
                <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}