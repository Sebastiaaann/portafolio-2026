import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import ExperienceItem from "./ExperienceItem";

interface CVDrawerProps {
  compact?: boolean;
}

export default function CVDrawer({ compact = false }: CVDrawerProps) {
  return (
    <Drawer shouldScaleBackground={true}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={`rounded-full border-zinc-200 font-medium transition-colors transition-transform hover:bg-zinc-100 active:scale-[0.96] will-change-transform ${compact ? "px-4 text-[15px] sm:px-6 sm:text-sm" : "px-6"}`}
        >
          {compact ? (
            <>
              <span className="sm:hidden">Ver CV</span>
              <span className="hidden sm:inline">Ver CV Completo</span>
            </>
          ) : (
            "Ver CV Completo"
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-transparent border-none shadow-none outline-none [&>div:first-child]:hidden">
        <div className="bg-[#FEFFFE] shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_3px_rgb(0,0,0,0.02)] rounded-[32px] mb-4 mx-4 sm:mx-auto w-[calc(100%-2rem)] sm:w-full max-w-[361px] p-4 relative">
          <DrawerClose asChild>
            <button 
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF0F0] text-[#FF3F40] transition-colors transition-transform hover:bg-red-100 active:scale-[0.96] will-change-transform"
              type="button" 
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4854 1.99998L2.00007 10.4853" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M10.4854 10.4844L2.00007 1.99908" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </DrawerClose>
          
          <header className="mb-4 flex h-[72px] items-center border-b border-zinc-100 pl-2">
            <h2 className="text-[19px] font-bold text-zinc-900 tracking-tight text-balance antialiased">
              Curriculum
            </h2>
          </header>
          
          <div className="space-y-3">
            <a href="/sebastian-cv.pdf" target="_blank" rel="noopener noreferrer" className="text-left flex h-12 w-full items-center gap-[15px] rounded-2xl bg-[#F7F8F9] px-4 text-[17px] font-medium text-zinc-900 transition-colors transition-transform hover:bg-zinc-200 active:scale-[0.96] will-change-transform">
              Descargar CV (PDF)
            </a>
            
            <Drawer nested={true}>
              <DrawerTrigger asChild>
                <button className="text-left flex h-12 w-full items-center gap-[15px] rounded-2xl bg-[#F7F8F9] px-4 text-[17px] font-medium text-zinc-900 transition-colors transition-transform hover:bg-zinc-200 active:scale-[0.96] will-change-transform">
                  Sobre mi
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-[#FEFFFE] h-[90vh] flex flex-col p-4 rounded-t-[32px] !border-none !shadow-none !outline-none [&>div:first-child]:hidden">
                <DrawerClose asChild>
                  <button 
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF0F0] text-[#FF3F40] transition-colors transition-transform hover:bg-red-100 active:scale-[0.96] will-change-transform"
                    type="button" 
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.4854 1.99998L2.00007 10.4853" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path d="M10.4854 10.4844L2.00007 1.99908" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </button>
                </DrawerClose>
                <div className="mx-auto w-full max-w-2xl flex flex-col h-full overflow-hidden relative">
                  <header className="mb-2 flex h-[72px] shrink-0 items-center border-b border-zinc-100 pl-2 pr-12">
                    <h2 className="text-[19px] font-bold text-zinc-900 tracking-tight text-balance antialiased">
                      Sobre mi
                    </h2>
                  </header>
                  <ScrollArea className="flex-1 h-full px-2 overflow-y-auto">
                    <div className="flex flex-col gap-12 pb-12 pt-4">
                      {/* Experiencia */}
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-zinc-900 border-b border-zinc-200 pb-4 mb-8 text-balance">Experiencia</h2>
                        <div className="flex flex-col gap-8">
                          <ExperienceItem
                            company="AccuHealth"
                            role="Desarrollador Front-End"
                            meta="Práctica Profesional"
                            dates="01.2026 - 04.2026"
                            description="Lideré el desarrollo de la SPA 'MIO-Web' (Vue 3 + TS), logrando un entorno modular para funcionalidades críticas. Implementé arquitecturas de carga asíncrona, caché TTL vía BFF y pruebas automatizadas con Vitest/Playwright, eliminando la pérdida de datos ante desconexiones."
                            tech={['Vue 3', 'TypeScript', 'Vitest', 'Playwright', 'SPA', 'BFF']}
                          />
                          <ExperienceItem
                            company="NotiChile©"
                            role="Proyecto Full-Stack"
                            meta="Plataforma de Licitaciones"
                            dates="03.2021 - 04.2025"
                            description="Diseñé y desarrollé una plataforma full-stack para monitoreo de licitaciones de ChileCompra. App móvil en React Native + Expo y backend en Node.js + Express + PostgreSQL. Integré notificaciones push segmentadas, worker de ingesta automática y monitoreo."
                            tech={['React Native', 'Node.js', 'PostgreSQL', 'Express', 'TypeScript']}
                          />
                          <ExperienceItem
                            company="Rodolfo SPA"
                            role="Digitalización de Procesos Operativos"
                            meta="Independiente"
                            dates="Proyecto Independiente"
                            description="Identifiqué ineficiencias en el registro manual de accesos y desarrollé de forma independiente una aplicación digital para el control de visitas. Eliminé el uso de papel, centralicé la información y reduje drásticamente los tiempos de procesamiento."
                            tech={['Desarrollo Web', 'Digitalización', 'UI/UX']}
                          />
                        </div>
                      </div>

                      {/* Educación */}
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-zinc-900 border-b border-zinc-200 pb-4 mb-8 text-balance">Educación y Certificaciones</h2>
                        <div className="flex flex-col gap-8">
                          <ExperienceItem
                            company="Instituto Profesional INACAP"
                            role="Ingeniero en Informática"
                            meta="Título Profesional"
                            dates="2024 - 2025"
                            iconType="education"
                          />
                          <ExperienceItem
                            company="Instituto Profesional INACAP"
                            role="Técnico de Nivel Superior Analista Programador"
                            meta="Título Técnico"
                            dates="2022 - 2023"
                            iconType="education"
                          />
                          <ExperienceItem
                            company="Certificaciones INACAP"
                            role="Desarrollador Full Stack & Diseño y Gestión de Base de Datos"
                            meta="Certificaciones"
                            dates="2025"
                            iconType="education"
                          />
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </DrawerContent>
            </Drawer>
            <DrawerClose asChild>
              <button className="text-left flex h-12 w-full items-center gap-[15px] rounded-2xl bg-[#F7F8F9] px-4 text-[17px] font-medium text-zinc-900 transition-colors transition-transform hover:bg-zinc-200 active:scale-[0.96] will-change-transform">
                Cerrar
              </button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
