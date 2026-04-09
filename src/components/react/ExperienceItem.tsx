import { useState } from 'react';
import { Code2, ChevronDown, GraduationCap } from 'lucide-react';

export default function ExperienceItem({ company, role, meta, dates, description, tech, iconType }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const renderIcon = () => {
    if (iconType === 'education') return <GraduationCap className="size-3.5" />;
    return <Code2 className="size-3.5" />;
  };

  return (
    <div className="flex flex-col relative group">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-zinc-400" />
        <span className="text-zinc-900 font-bold text-lg">{company}</span>
      </div>
      
      <div className="ml-[3px] border-l border-zinc-200 mt-2 flex flex-col pb-2">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          disabled={!description}
          className={`w-full text-left relative min-h-[44px] p-2 -ml-2 rounded-lg flex flex-col gap-2 ${description ? 'transition-colors hover:bg-zinc-50 cursor-pointer' : 'cursor-default'}`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 pl-3">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-500">
                {renderIcon()}
              </div>
              <span className="text-zinc-800 font-semibold text-base">{role}</span>
            </div>
            {description && (
              <div className="shrink-0 text-zinc-400">
                <ChevronDown className={`size-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 pl-11 text-sm text-zinc-600">
            <span>{meta}</span>
            <div className="w-px h-3 bg-zinc-300"></div>
            <span className="font-mono text-[11px] uppercase tracking-wider tabular-nums">{dates}</span>
          </div>
        </button>

        {description && (
          <div 
            className={`grid transition-[grid-template-rows] duration-300 ease-out ml-9 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
          >
            <div className="overflow-hidden">
              <p className="text-base text-zinc-700 leading-relaxed pt-2 pb-2 text-pretty">
                {description}
              </p>
            </div>
          </div>
        )}

        {tech && tech.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 pt-3 pl-9">
            {tech.map((t: string) => (
              <li key={t} className="flex">
                <span className="inline-flex items-center rounded border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 font-mono text-xs font-medium text-zinc-700">
                  {t}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}