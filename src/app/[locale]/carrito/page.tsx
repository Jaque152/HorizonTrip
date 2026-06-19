// app/[locale]/carrito/page.tsx
"use client";
import { T } from "@/components/T";
import { useLocale } from 'next-intl';
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import {
  Trash2, Minus, Plus, ShoppingBag, ArrowRight,
  Calendar, MapPin
} from "lucide-react";

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const locale = useLocale();

  const formatPrice = (price: number) => {
    const formatter = new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", minimumFractionDigits: 0,
    });
    return `${formatter.format(price)} MXN`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-MX", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-screen-xl">
          
          {/* Cabecera del Carrito */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-foreground/10 pb-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-3">
                <span className="h-[1px] w-8 bg-primary"></span>
                <span className="text-xs font-bold text-foreground/50 tracking-[0.4em] uppercase">
                  <T>Tu Carrito</T>
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-4">
                <T>Selección</T> <span className="font-light italic text-primary"><T>Actual.</T></span>
              </h1>
              <p className="text-lg font-medium text-muted-foreground">
                {cart.items.length} {cart.items.length === 1 ? <T>experiencia</T> : <T>experiencias</T>} <T>en tu ruta.</T>
              </p>
            </div>
            {cart.items.length > 0 && (
              <Button variant="ghost" onClick={clearCart} className="text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-full font-bold uppercase tracking-widest text-xs transition-colors h-12 px-6">
                <Trash2 className="w-4 h-4 mr-2" /> <T>Vaciar Carrito</T>
              </Button>
            )}
          </div>

          {cart.items.length === 0 ? (
            /* Estado Vacío */
            <div className="py-24 text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-foreground/10">
                <ShoppingBag className="w-8 h-8 text-foreground/20" strokeWidth={1} />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-foreground mb-4"><T>Tu ruta está en blanco</T></h2>
              <p className="text-muted-foreground font-medium mb-10 max-w-md mx-auto"><T>Explora nuestra colección y selecciona las experiencias que definirán tu próximo viaje.</T></p>
              <Button asChild className="h-14 px-10 rounded-full bg-foreground hover:bg-primary text-background font-bold tracking-widest uppercase text-sm transition-all shadow-xl group">
                <Link href={`/${locale}/experiencias`}>
                  <T>Ir a la Colección</T>
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Lista de Experiencias */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                {cart.items.map((item) => {
                  const itemImage = item.experience.images && item.experience.images.length > 0 
                                      ? item.experience.images[0] 
                                      : '/placeholder.jpg';
                  
                  return (
                    <div key={`${item.activityId}-${item.date}`} className="group flex flex-col sm:flex-row gap-6 pb-8 border-b border-foreground/10 hover:border-primary transition-colors">
                      
                      {/* Imagen */}
                      <div className="w-full sm:w-48 aspect-[4/3] sm:aspect-[3/4] flex-shrink-0 overflow-hidden rounded-2xl">
                        <img src={itemImage} alt={item.experience.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      
                      {/* Detalles */}
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase border border-primary/20 px-3 py-1 rounded-full">
                              <T>{item.experience.plan_type}</T>
                            </span>
                            <button onClick={() => removeFromCart(item.activityId, item.date)} className="text-foreground/30 hover:text-red-500 transition-colors shrink-0">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <h3 className="text-3xl font-black tracking-tight text-foreground mb-4"><T>{item.experience.title}</T></h3>
                          
                          <div className="flex flex-col gap-2 text-sm font-medium text-muted-foreground mb-6">
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {item.experience.destination}</span>
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> <T>{formatDate(item.date)}</T></span>
                          </div>
                        </div>
                        
                        <div className="flex items-end justify-between mt-auto">
                          {/* Controles de Pax */}
                          <div className="flex items-center gap-4 bg-transparent border-b border-foreground/20 pb-1">
                            <button className="text-foreground/50 hover:text-foreground disabled:opacity-30" onClick={() => updateQuantity(item.activityId, item.date, item.people - 1)} disabled={item.people <= 1}><Minus className="w-4 h-4" /></button>
                            <span className="font-black text-lg w-6 text-center text-foreground">{item.people}</span>
                            <button className="text-foreground/50 hover:text-primary" onClick={() => updateQuantity(item.activityId, item.date, item.people + 1)}><Plus className="w-4 h-4" /></button>
                          </div>
                          
                          {/* Precio */}
                          <div className="text-right">
                            <p className="text-2xl font-black text-foreground">{formatPrice(item.totalPrice)}</p>
                            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest"><T>IVA incluido</T></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Panel Lateral: Resumen */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="bg-foreground rounded-[2rem] p-8 md:p-10 sticky top-32 shadow-2xl text-background">
                  <h2 className="text-2xl font-black mb-8 tracking-tight"><T>Resumen del Carrito</T></h2>
                  
                  <div className="space-y-4 mb-8 text-sm font-medium text-background/60">
                    <div className="flex justify-between">
                      <span><T>Subtotal</T></span>
                      <span className="text-background">{formatPrice(cart.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span><T>Gestión Concierge</T></span>
                      <span className="text-background"><T>Incluida</T></span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mb-10 pt-8 border-t border-background/20">
                    <span className="text-background/50 font-bold uppercase tracking-widest text-[10px]"><T>Total a Pagar</T></span>
                    <span className="text-4xl font-black text-primary">{formatPrice(cart.total)}</span>
                  </div>

                  <Button asChild className="w-full h-16 rounded-full bg-primary hover:bg-background text-white hover:text-foreground font-bold tracking-widest uppercase text-sm transition-colors shadow-xl group">
                    <Link href={`/${locale}/checkout`}>
                      <T>Confirmar Ruta</T>
                      <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}