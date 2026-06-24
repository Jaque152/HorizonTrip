"use client";

import { T } from "@/components/T";
import { useLocale } from 'next-intl';
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react"; 
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: <T>Inicio</T> },
  { href: "/nosotros", label: <T>Nosotros</T> },
  { href: "/experiencias", label: <T>Catálogo</T> }, 
  { href: "/#contacto", label: <T>Concierge</T> },
];

export function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart, getItemCount } = useCart();
  const itemCount = getItemCount();

  // 1. Detectar si estamos exactamente en la página de inicio
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  // 2. Escuchar el evento de scroll para cambiar el diseño al bajar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Lógica dinámica de estilos
  // El header solo es transparente si estamos en el Home Y no hemos hecho scroll
  const isTransparent = isHome && !isScrolled;

  const headerBg = isTransparent 
    ? "bg-transparent" 
    : "bg-background/90 backdrop-blur-xl border-b border-foreground/10 shadow-sm";
    
  const paddingClass = isTransparent ? "py-8" : "py-4";
  
  const logoTextColor = isTransparent ? "text-white drop-shadow-md" : "text-foreground";
  const linkTextColor = isTransparent ? "text-white/90 hover:text-white" : "text-foreground/60 hover:text-foreground";
  const underlineColor = isTransparent ? "bg-white" : "bg-primary";
  const iconColor = isTransparent ? "text-white hover:text-primary drop-shadow-md" : "text-foreground hover:text-primary";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out ${headerBg} ${paddingClass}`}>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Logo Tipográfico HorizonTrip */}
        <Link href={`/${locale}/`} className="relative z-50">
          <span className={`text-2xl md:text-3xl font-black tracking-tighter transition-colors duration-300 ${logoTextColor}`}>
            Horizon<span className="font-light italic text-primary drop-shadow-none">Trip.</span>
          </span>
        </Link>

        {/* Navegación Desktop */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={`/${locale}${link.href}`}
              className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 relative group ${linkTextColor}`}
            >
              {link.label}
              <span className={`absolute -bottom-2 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${underlineColor}`} />
            </Link>
          ))}
        </nav>

        {/* Sección Derecha: Carrito y Menú Móvil */}
        <div className="flex items-center gap-6 relative z-50">
          
          {/* Icono del Carrito Boutique */}
          <div
            className="relative"
            onMouseEnter={() => setShowMiniCart(true)}
            onMouseLeave={() => setShowMiniCart(false)}
          >
            <Link href={`/${locale}/carrito`} className={`flex items-center gap-2 transition-colors duration-300 ${iconColor}`}>
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-md">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Dropdown Mini Carrito */}
            {showMiniCart && (
              <div className="absolute right-0 top-full mt-6 w-80 bg-background/95 backdrop-blur-xl rounded-2xl overflow-hidden z-50 border border-border shadow-2xl animate-reveal">
                <div className="p-5 border-b border-border/50">
                  <h3 className="font-bold text-sm tracking-widest uppercase text-foreground/80">
                    <T>Tu Dossier</T>
                  </h3>
                </div>
                {cart.items.length === 0 ? (
                  <div className="p-8 text-center text-sm font-medium text-muted-foreground flex flex-col items-center gap-3">
                    <ShoppingBag className="w-8 h-8 opacity-20" strokeWidth={1} />
                    <T>Aún no hay rutas seleccionadas</T>
                  </div>
                ) : (
                  <>
                    <div className="max-h-64 overflow-y-auto p-4 flex flex-col gap-4">
                      {cart.items.slice(0, 3).map((item) => {
                        const miniImage = item.experience.images && item.experience.images.length > 0 
                                            ? item.experience.images[0] : '/placeholder.jpg';
                        return (
                          <div key={`${item.activityId}-${item.date}`} className="flex gap-4 items-center group cursor-default">
                            <img src={miniImage} className="w-16 h-16 rounded-xl object-cover" alt={item.experience.title} />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors"><T>{item.experience.title}</T></h4>
                              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">{item.people}p • <T>{item.experience.plan_type}</T></p>
                              <p className="text-sm font-black text-foreground">{formatPrice(item.totalPrice)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-4 bg-background border-t border-border/50">
                      <Link href={`/${locale}/carrito`} className="block w-full py-4 bg-foreground text-background hover:bg-primary transition-colors text-center rounded-xl text-xs uppercase tracking-widest font-bold shadow-xl">
                        <T>Finalizar Reserva</T>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Botón de Menú Móvil */}
          <button 
            className={`lg:hidden transition-colors duration-300 ${iconColor}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Overlay del Menú Móvil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-background z-40 flex flex-col justify-center items-center p-6 animate-fade-in">
          <nav className="flex flex-col items-center gap-8">
            {navLinks.map((link, index) => (
              <Link 
                key={index} 
                href={`/${locale}${link.href}`} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-black text-foreground hover:text-primary transition-colors uppercase tracking-widest"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-8 right-6 text-foreground"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
      )}
    </header>
  );
}