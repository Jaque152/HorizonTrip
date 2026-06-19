"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";
import { useCart } from "@/context/CartContext";
import { ArrowRight, FileText, User, Mail, Calendar, ShieldCheck } from "lucide-react";

export default function PagoFolioPage() {
  const router = useRouter();
  const locale = useLocale();
  const { addToCart } = useCart();
  
  // Estados
  const [monto, setMonto] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [folio, setFolio] = useState("");
  const [fecha, setFecha] = useState("");

  const btnConfirmar = useT("Añadir al Dossier");

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, ''); 
    setMonto(val);
  };

  const isFormValid = 
    parseFloat(monto) > 0 && 
    nombre.trim().length > 0 && 
    email.includes("@") && 
    folio.trim().length > 0 && 
    fecha !== "";

  const handleConfirmarReserva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const montoNumerico = parseFloat(monto);

    // Estructura actualizada para coincidir con la nueva base de datos y CartItem
    const customExperienceItem = {
      activityId: 0,
      experience: {
        id: 0,
        title: "Diseño de Ruta a la Medida",
        slug: "ruta-a-la-medida",
        plan_type: "Personalizada",
        destination: "Múltiples Destinos",
        price: montoNumerico,
        currency: "MXN",
        tax_included: true,
        description: `Pago asociado al folio de concierge: ${folio}`,
        suggested_route: [],
        included: ["Itinerario personalizado", "Gestión de Concierge", "Soporte 24/7"],
        logistics: {},
        category_id: 0,
        images: ["https://images.pexels.com/photos/7709272/pexels-photo-7709272.jpeg"]
      },
      date: fecha,
      people: 1, 
      pricePerPerson: montoNumerico,
      totalPrice: montoNumerico
    };

    addToCart(customExperienceItem);
    sessionStorage.setItem("explonix_temp_contact", JSON.stringify({ nombre, email, folio })); 
    router.push(`/${locale}/checkout`);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  // Estilo editorial para inputs
  const inputClass = "h-14 border-0 border-b-2 border-foreground/10 bg-transparent focus-visible:ring-0 focus-visible:border-primary rounded-none px-0 font-medium text-lg text-foreground placeholder:text-foreground/30 transition-colors w-full";
  const labelClass = "text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2 block";

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Header />
      <main className="flex-1 pt-32 pb-32">
        
        {/* Cabecera Editorial */}
        <section className="container mx-auto px-6 lg:px-12 max-w-screen-xl mb-16">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-3">
              <span className="h-[1px] w-8 bg-primary"></span>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/60">
                <T>Servicios Privados</T>
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6 leading-[0.9]">
              <T>Liquidación de</T><br/>
              <span className="font-light italic text-primary"><T>Folio.</T></span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-xl leading-relaxed">
              <T>Procesamiento seguro para itinerarios a la medida y servicios exclusivos de HorizonTrip. Ingresa los detalles de tu folio asignado para proceder al checkout.</T>
            </p>
          </div>
        </section>

        {/* Formulario Estilo Dossier */}
        <section className="container mx-auto px-6 lg:px-12 max-w-screen-xl">
          <div className="bg-white rounded-[2rem] border border-border/50 shadow-2xl p-8 md:p-12 lg:p-16 max-w-4xl">
            
            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-foreground/10">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-foreground"><T>Detalles de la Operación</T></h2>
                <p className="text-muted-foreground font-medium text-sm"><T>Tus datos están protegidos y encriptados de extremo a extremo.</T></p>
              </div>
            </div>

            <form onSubmit={handleConfirmarReserva} className="space-y-12">
              
              {/* Bloque Destacado: Monto */}
              <div className="bg-foreground rounded-[1.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                  <FileText className="w-64 h-64 text-white" />
                </div>
                <div className="relative z-10">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4 block"><T>Valor de Inversión (MXN + IVA)</T></label>
                  <div className="flex items-end gap-4 border-b border-white/20 pb-4 focus-within:border-primary transition-colors">
                    <span className="text-5xl md:text-6xl font-light text-white/30">$</span>
                    <Input 
                      type="text" 
                      value={monto}
                      onChange={handleMontoChange}
                      placeholder="0.00"
                      required
                      className="border-none bg-transparent p-0 text-5xl md:text-6xl font-black text-white focus-visible:ring-0 shadow-none h-auto placeholder:text-white/20 tracking-tighter"
                    />
                  </div>
                </div>
              </div>

              {/* Grid de Datos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                <div className="group">
                  <label className={labelClass}><T>Nombre del Titular</T></label>
                  <div className="relative">
                    <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="text" 
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      placeholder="Nombre completo"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className={labelClass}><T>Correo de Contacto</T></label>
                  <div className="relative">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="correo@ejemplo.com"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className={labelClass}><T>Folio Asignado</T></label>
                  <div className="relative">
                    <FileText className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="text" 
                      value={folio}
                      onChange={(e) => setFolio(e.target.value.toUpperCase())}
                      required
                      placeholder="Ej: HT-001"
                      className={`${inputClass} pl-8 uppercase tracking-widest`}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className={labelClass}><T>Fecha de Inicio de Ruta</T></label>
                  <div className="relative">
                    <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="date" 
                      value={fecha}
                      min={minDateStr}
                      onChange={(e) => setFecha(e.target.value)}
                      required
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>
              </div>

              {/* Botón de Envío */}
              <div className="pt-10">
                <button 
                  type="submit" 
                  disabled={!isFormValid}
                  className="w-full h-16 bg-foreground hover:bg-primary text-background font-bold rounded-full shadow-xl transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                >
                  <span className="text-sm uppercase tracking-widest">
                    {btnConfirmar}
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
            </form>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}