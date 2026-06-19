"use client";

import { T } from "@/components/T";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLocale } from 'next-intl';

export function Contact() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error: dbError } = await supabase.from("contact_messages_horizon").insert([{ full_name: formData.name, email: formData.email, phone: formData.phone, message: formData.message }]);
      if (dbError) throw dbError;
      const response = await fetch("/api/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "CONTACT", ...formData, customerName: formData.name }) });
      if (!response.ok) throw new Error("No se pudo enviar");
      alert(locale === 'en' ? "Message sent successfully!" : "¡Mensaje enviado con éxito!");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      alert(locale === 'en' ? "There was an error sending your message." : "Hubo un error al enviar tu mensaje.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 lg:py-32 bg-background relative border-t border-foreground/10">
      <div className="container mx-auto px-6 lg:px-12 max-w-screen-xl">
        
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Lado Izquierdo: Narrativa y Contacto Directo */}
          <div className="space-y-12">
            <div>
              <div className="mb-6 inline-flex items-center gap-3">
                <span className="h-[1px] w-12 bg-primary"></span>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/60">
                  <T>Atención Privada</T>
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.9] mb-6">
                <T>Inicia tu</T><br/>
                <span className="font-light italic text-primary"><T>travesía.</T></span>
              </h2>
              <p className="text-lg text-muted-foreground font-medium max-w-md leading-relaxed">
                <T>Comparte los primeros trazos de tu viaje. Nuestro equipo de diseño de rutas trazará una propuesta inicial en menos de 24 horas.</T>
              </p>
            </div>

            <div className="space-y-4">
              <a href="mailto:hola@horizontrip.com.mx" className="block text-xl md:text-2xl font-black text-foreground hover:text-primary transition-colors tracking-tight">
                hola@horizontrip.com.mx
              </a>
              <a href="tel:+525555555555" className="block text-xl md:text-2xl font-black text-foreground hover:text-primary transition-colors tracking-tight">
                +52 55 5555 5555
              </a>
            </div>
          </div>

          {/* Lado Derecho: Formulario Editorial Minimalista */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-10">
              
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-3 relative group">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 transition-colors group-focus-within:text-primary"><T>Nombre</T></label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    placeholder={locale === 'en' ? 'Your full name' : 'Tu nombre completo'} 
                    required 
                    className="h-12 border-0 border-b-2 border-foreground/10 focus-visible:ring-0 focus-visible:border-primary rounded-none px-0 font-medium text-lg bg-transparent text-foreground placeholder:text-foreground/40 transition-colors" 
                  />
                </div>
                <div className="space-y-3 relative group">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 transition-colors group-focus-within:text-primary"><T>Teléfono</T></label>
                  <Input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                    placeholder={locale === 'en' ? '+1' : '+52'} 
                    required 
                    className="h-12 border-0 border-b-2 border-foreground/10 focus-visible:ring-0 focus-visible:border-primary rounded-none px-0 font-medium text-lg bg-transparent text-foreground placeholder:text-foreground/40 transition-colors" 
                  />
                </div>
              </div>

              <div className="space-y-3 relative group">
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 transition-colors group-focus-within:text-primary"><T>Correo Electrónico</T></label>
                <Input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  placeholder={locale === 'en' ? 'example@mail.com' : 'ejemplo@correo.com'} 
                  required 
                  className="h-12 border-0 border-b-2 border-foreground/10 focus-visible:ring-0 focus-visible:border-primary rounded-none px-0 font-medium text-lg bg-transparent text-foreground placeholder:text-foreground/40 transition-colors" 
                />
              </div>

              <div className="space-y-3 relative group">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 transition-colors group-focus-within:text-primary"><T>Visión del Viaje</T></label>
                  <span className="text-[10px] font-bold text-foreground/30">{formData.message.length}/180</span>
                </div>
                <Textarea 
                  value={formData.message} 
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                  placeholder={locale === 'en' ? 'Tell us about your dates, destinations or expectations...' : 'Cuéntanos sobre tus fechas, destinos o expectativas...'} 
                  rows={3} 
                  maxLength={180} 
                  className="border-0 border-b-2 border-foreground/10 focus-visible:ring-0 focus-visible:border-primary rounded-none px-0 font-medium text-lg bg-transparent text-foreground placeholder:text-foreground/40 resize-none transition-colors" 
                />
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={!formData.name || isSubmitting} 
                  className="h-16 w-full md:w-auto px-12 rounded-full bg-foreground hover:bg-primary text-background font-bold uppercase tracking-widest text-sm transition-all group"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <T>Enviar Solicitud</T>}
                  {!isSubmitting && <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />}
                </Button>
              </div>

            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
}