"use client";
import { useLocale } from 'next-intl';
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase';
import { MapPin, Search, ArrowRight, Loader2, Compass } from "lucide-react";
import { Experience, SupabaseExperienceResponse } from "@/lib/types";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";
import { Card } from "@/components/ui/card";

function ExperienciasContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("categoria");
  const locale = useLocale();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchTerm, setSearchTerm] = useState("");
  const phSearch = useT("Buscar destino o experiencia...");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data: catData } = await supabase.from('categories_horizon').select('*');
        if (catData) setCategories(catData);

        // Consulta simplificada: leemos directamente de la tabla principal
        const { data: actData, error: actError } = await supabase
          .from('activities_horizon')
          .select(`
            id, title, slug, plan_type, destination, price, description, images, category_id,
            categories:categories_horizon (id, name, slug)
          `);

        if (actData) {
          const mappedData: Experience[] = (actData as unknown as SupabaseExperienceResponse[]).map((item) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            plan_type: item.plan_type,
            destination: item.destination,
            price: item.price,
            currency: item.currency || 'MXN',
            tax_included: item.tax_included !== false,
            description: item.description || "",
            images: item.images || [], 
            category_id: item.category_id,
            categories: item.categories || undefined,
            suggested_route: [],
            included: [],
            logistics: {}
          }));
          setExperiences(mappedData);
        }
      } catch (error) {
        console.error("Error fetchData:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const filteredExperiences = experiences.filter((exp) => {
    const matchesCategory = !selectedCategory || exp.categories?.slug === selectedCategory;
    const matchesSearch = !searchTerm ||
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.destination.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    const formatter = new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", minimumFractionDigits: 0,
    });
    return `${formatter.format(price)} MXN`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Header />
      <main className="flex-1 pt-32">
        
        {/* Cabecera Editorial (HorizonTrip Style) */}
        <section className="pb-16 pt-8">
          <div className="container mx-auto px-6 lg:px-12 max-w-screen-xl text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-3 justify-center md:justify-start w-full md:w-auto">
                <span className="h-[1px] w-8 bg-primary"></span>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/60">
                  <T>Catálogo Oficial</T>
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6 leading-[0.9]">
                <T>Encuentra tu</T> <span className="font-light italic text-primary"><T>horizonte.</T></span>
              </h1>
            </div>
          </div>
        </section>

        {/* Barra de Filtros Minimalista */}
        <section className="sticky top-24 z-40 mb-16 bg-background/90 backdrop-blur-xl border-y border-foreground/10 py-4">
          <div className="container mx-auto px-6 lg:px-12 max-w-screen-xl flex flex-col lg:flex-row gap-6 items-center justify-between">
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 w-full lg:w-auto">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`text-sm font-bold uppercase tracking-widest transition-all pb-1 border-b-2 ${!selectedCategory ? 'border-primary text-foreground' : 'border-transparent text-foreground/40 hover:text-foreground'}`}
              >
                <T>Ver Todo</T>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`text-sm font-bold uppercase tracking-widest transition-all pb-1 border-b-2 ${selectedCategory === cat.slug ? 'border-primary text-foreground' : 'border-transparent text-foreground/40 hover:text-foreground'}`}
                >
                  <T>{cat.name}</T>
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <Input
                placeholder={phSearch}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-10 border-0 border-b-2 border-foreground/10 focus-visible:ring-0 focus-visible:border-primary rounded-none bg-transparent font-medium text-foreground placeholder:text-foreground/30"
              />
            </div>
          </div>
        </section>

        {/* Grid de Experiencias Estilo Revista */}
        <section className="pb-32">
          <div className="container mx-auto px-6 lg:px-12 max-w-screen-xl">
            {filteredExperiences.length === 0 ? (
              <div className="text-center py-32 border border-foreground/10 rounded-3xl">
                <Compass className="w-12 h-12 text-foreground/20 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-foreground mb-2"><T>Ruta no encontrada</T></h3>
                <p className="text-muted-foreground font-medium"><T>Intenta ajustando los filtros o tu búsqueda.</T></p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredExperiences.map((exp) => {
                  const thumbImage = exp.images?.length > 0 ? exp.images[0] : '/placeholder.jpg';

                  return (
                    <Link key={exp.id} href={`/${locale}/experiencias/${exp.id}`} className="group block h-[450px] lg:h-[550px]">
                      <Card className="h-full relative overflow-hidden border-none rounded-[2rem] shadow-none hover:shadow-2xl transition-all duration-500 bg-foreground">
                        
                        {/* Imagen de fondo inmersiva */}
                        <img src={thumbImage} alt={exp.title} className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 opacity-90" />
                        
                        {/* Gradiente de contraste */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/90 transition-opacity group-hover:opacity-100" />

                        <div className="absolute inset-0 p-8 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest border border-white/20">
                              <T>{exp.plan_type}</T>
                            </span>
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          
                          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-primary mb-2 uppercase tracking-widest">
                              <MapPin className="w-3 h-3" /> <T>{exp.destination}</T>
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-black tracking-tight text-white mb-4"><T>{exp.title}</T></h3>
                            <div className="flex items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-0 group-hover:h-auto overflow-hidden">
                              <span className="text-2xl font-black text-white">{formatPrice(exp.price)}</span>
                              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5"><T>Desde</T></span>
                            </div>
                          </div>
                        </div>

                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function ExperienciasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    }>
      <ExperienciasContent />
    </Suspense>
  );
}