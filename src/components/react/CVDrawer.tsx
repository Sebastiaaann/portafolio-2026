import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function CVDrawer() {
  return (
    <Drawer shouldScaleBackground={true}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="rounded-full px-6 font-medium border-zinc-200 transition-colors transition-transform hover:bg-zinc-100 active:scale-[0.96] will-change-transform">
          Ver CV Completo
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
              CV Options
            </h2>
          </header>
          
          <div className="space-y-3">
            <a href="/sebastian-cv.pdf" target="_blank" rel="noopener noreferrer" className="text-left flex h-12 w-full items-center gap-[15px] rounded-2xl bg-[#F7F8F9] px-4 text-[17px] font-medium text-zinc-900 transition-colors transition-transform hover:bg-zinc-200 active:scale-[0.96] will-change-transform">
              Descargar CV (PDF)
            </a>
            <button className="text-left flex h-12 w-full items-center gap-[15px] rounded-2xl bg-[#F7F8F9] px-4 text-[17px] font-medium text-zinc-900 transition-colors transition-transform hover:bg-zinc-200 active:scale-[0.96] will-change-transform">
              Ver Certificados
            </button>
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