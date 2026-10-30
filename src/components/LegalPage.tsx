"use client";
import { T } from "@/components/T";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface LegalPageProps {
  title: string;
  sections: {
    heading: string;
    content: string;
  }[];
}

export function LegalPage({ title, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-40 pb-32">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Lado Izquierdo: Título Masivo e Índice Sticky */}
            <div className="w-full lg:w-1/3 lg:sticky lg:top-40 h-fit">
              <h1 className="text-5xl md:text-5xl font-black mb-8 tracking-tighter text-slate-800 leading-[1.1]">
                <T>{title}</T>
              </h1>
              <div className="hidden lg:block border-l-2 border-slate-100 pl-6 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6"><T>Contenido</T></p>
                {sections.map((section, idx) => (
                  <p key={idx} className="text-sm font-bold text-slate-500 hover:text-primary cursor-pointer transition-colors line-clamp-1">
                    <T>{section.heading}</T>
                  </p>
                ))}
              </div>
            </div>

            {/* Lado Derecho: Contenido de texto (Lectura limpia) */}
            <div className="w-full lg:w-2/3">
              <div className="space-y-16">
                {sections.map((section, index) => (
                  <div key={index} className="scroll-mt-32">
                    <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">
                      <T>{section.heading}</T>
                    </h2>
                    <p className="text-slate-600 font-medium text-lg leading-relaxed whitespace-pre-line">
                      <T>{section.content}</T>
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}