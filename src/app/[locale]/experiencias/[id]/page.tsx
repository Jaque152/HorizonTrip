"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { Experience } from "@/lib/types"; 
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";
import { useLocale } from 'next-intl';
import {
  Check, Minus, Plus, Loader2, MapPin, Clock, ArrowRight, Sparkles
} from "lucide-react";

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const { addToCart } = useCart();
  const phDestino = useT("Ej. Oaxaca, Los Cabos, Tulum...");

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState("");
  const [people, setPeople] = useState(1);
  const [customDestination, setCustomDestination] = useState(""); // Nuevo estado para destino personalizado
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadFullDetail() {
      if (!params.id) return;
      setLoading(true);
      try {
        const { data: activity } = await supabase
          .from('activities_horizon')
          .select('*, categories:categories_horizon(name, slug)')
          .eq('id', params.id)
          .single();

        if (activity) {
          setExperience(activity as Experience);
        }
      } catch (error) {
        console.error("Error loadFullDetail:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFullDetail();
  }, [params.id]);

  const formatPrice = (price: number) => {
    const formatter = new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", minimumFractionDigits: 0,
    });
    return `${formatter.format(price)} MXN`;
  };

  // Verificamos si es una ruta a la medida (Bloque 6)
  const isPersonalized = experience?.plan_type === 'PERSONALIZADA';

  const handleAddToCart = () => {
    if (!experience || !selectedDate) return;
    if (isPersonalized && !customDestination.trim()) return; // Validación extra

    setIsAdding(true);

    // Clonamos la experiencia para sobreescribir el destino si es personalizada
    const experienceToCart = isPersonalized 
      ? { ...experience, destination: customDestination } 
      : experience;

    addToCart({
      activityId: experience.id,
      experience: experienceToCart,
      date: selectedDate,
      people: people,
      pricePerPerson: Number(experience.price),
    });

    setTimeout(() => {
      setIsAdding(false);
      router.push(`/${locale}/carrito`);
    }, 500);
  };

  const minDateStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );

  if (!experience) return null;

  const mainImage = experience.images?.length > 0 ? experience.images[0] : '/placeholder.jpg';

  const renderWidgetForm = () => (
  <div className="bg-foreground text-background border border-foreground/10 shadow-2xl rounded-[2.5rem] overflow-hidden sticky top-32">
      <div className="p-8 lg:p-10">
        
        {/* Encabezado del Widget */}
        <div className="flex flex-col mb-8 pb-8 border-b border-background/20">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3"><T>Valor de Inversión</T></span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white tracking-tighter">{formatPrice(experience.price)}</span>
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest"><T>p/p</T></span>
          </div>
        </div>
        
        {/* Controles de Reserva */}
        <div className="space-y-6 mb-8">
          
          {/* Nuevo Campo: Destino (Solo visible para rutas personalizadas) */}
          {isPersonalized && (
            <div className="space-y-3 animate-fade-in">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest"><T>Destino Deseado</T></label>
              <Input 
                type="text" 
                name="customDestination"
                value={customDestination} 
                onChange={(e) => setCustomDestination(e.target.value)} 
                placeholder={phDestino}
                autoComplete="off"
                className="rounded-xl h-14 bg-background/10 font-bold text-white border-none focus-visible:ring-primary px-4 placeholder:text-white/30" 
              />
            </div>
          )}

          <div className="space-y-3">
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest"><T>Fecha de Inicio</T></label>
            <Input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              min={minDateStr} 
              className="rounded-xl h-14 bg-background/10 font-bold text-white border-none focus-visible:ring-primary px-4 color-scheme-dark" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest"><T>Viajeros</T></label>
            <div className="flex items-center justify-between rounded-xl h-14 bg-background/10 overflow-hidden border border-transparent focus-within:border-primary">
              <button className="h-full w-14 flex items-center justify-center hover:bg-background/20 text-white transition-colors" onClick={() => setPeople(Math.max(1, people - 1))}><Minus className="w-4 h-4"/></button>
              <span className="flex-1 text-center font-black text-xl text-white">{people}</span>
              <button className="h-full w-14 flex items-center justify-center hover:bg-background/20 text-white transition-colors" onClick={() => setPeople(people + 1)}><Plus className="w-4 h-4"/></button>
            </div>
          </div>
        </div>

        <Button 
          className="w-full bg-primary hover:bg-white text-white hover:text-foreground font-black h-16 rounded-full uppercase tracking-widest text-sm transition-all group"
          onClick={handleAddToCart}
          disabled={!selectedDate || isAdding || (isPersonalized && !customDestination.trim())}
        >
          {isAdding ? <Loader2 className="animate-spin w-5 h-5 mr-3 inline" /> : null}
          {isAdding ? <T>Integrando...</T> : <T>Añadir al Carrito</T>}
          {!isAdding && <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Header />
      
      <main className="flex-1 pt-32 pb-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-screen-xl">
          
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* COLUMNA IZQUIERDA: Narrativa y Detalles */}
            <div className="lg:col-span-7 space-y-16 w-full">
              
              {/* Título */}
              <div>
                <div className="mb-6 inline-flex items-center gap-3">
                  <span className="h-[1px] w-8 bg-primary"></span>
                  <span className="text-xs font-bold text-primary tracking-[0.4em] uppercase">
                    <T>{experience.plan_type}</T>
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tighter leading-[0.9]">
                  <T>{experience.title}</T>
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-foreground/60">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> 
                    {/* Si es personalizada y escribió algo, se muestra su destino, si no, el default */}
                    {isPersonalized && customDestination ? customDestination : <T>{experience.destination}</T>}
                  </div>
                  {experience.logistics?.duracion_estimada && (
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> <T>{experience.logistics.duracion_estimada}</T></div>
                  )}
                </div>
              </div>

              {/* Imagen Principal */}
              <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl group">
                <img src={mainImage} alt={experience.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>

              {/* Layout Mobile: Widget debajo de la imagen */}
              <div className="lg:hidden w-full">
                 {renderWidgetForm()}
              </div>

              {/* Descripción Editorial */}
              <section>
                <p className="text-foreground/80 font-medium leading-relaxed text-xl whitespace-pre-wrap">
                  <T>{experience.description}</T>
                </p>
              </section>

              {/* Ruta Sugerida */}
              {experience.suggested_route && experience.suggested_route.length > 0 && (
                <section className="border-t border-foreground/10 pt-16">
                  <h2 className="text-3xl font-black text-foreground mb-10 tracking-tight flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <T>Ruta Propuesta</T>
                  </h2>
                  <div className="grid gap-6">
                    {experience.suggested_route.map((step, i) => (
                      <div key={i} className="flex gap-6 items-start group">
                        <span className="text-3xl font-serif italic text-foreground/20 group-hover:text-primary transition-colors leading-none mt-1">
                          0{i + 1}
                        </span>
                        <p className="text-foreground/80 font-medium text-lg leading-relaxed pb-6 border-b border-foreground/10 w-full group-hover:border-primary transition-colors"><T>{step}</T></p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Características: Incluye y No Incluye (Lado a Lado) */}
              <section className="border-t border-foreground/10 pt-16 grid sm:grid-cols-2 gap-12">
                
                {/* Lo que incluye */}
                {experience.included && experience.included.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase text-foreground/50 tracking-widest mb-6"><T>Privilegios Incluidos</T></h3>
                    <ul className="space-y-4">
                      {experience.included.map((inc, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <Check className="w-5 h-5 text-primary shrink-0"/> 
                          <span className="text-base font-medium text-foreground/80 leading-snug"><T>{inc}</T></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Lo que no incluye */}
                {experience.logistics?.no_incluye && experience.logistics.no_incluye.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase text-foreground/50 tracking-widest mb-6"><T>Consideraciones</T></h3>
                    <ul className="space-y-4">
                      {experience.logistics.no_incluye.map((noInc, i) => (
                        <li key={i} className="flex items-start gap-4 opacity-70">
                          <Minus className="w-5 h-5 text-foreground/40 shrink-0"/> 
                          <span className="text-base font-medium text-foreground/70 leading-snug"><T>{noInc}</T></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </section>

            </div>

            {/* COLUMNA DERECHA: Widget Sticky */}
            <div className="hidden lg:block lg:col-span-5 w-full">
              {renderWidgetForm()}
            </div>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}