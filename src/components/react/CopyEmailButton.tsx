import React, { useState, useEffect } from 'react';

export default function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const email = "sebastian.almo9@gmail.com";

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      data-slot="button"
      data-variant="secondary"
      data-size="default"
      className="group/button shrink-0 justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-[#F5F5F5] text-[#171717] hover:bg-[#E5E5E5] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground h-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 pr-3! text-[14px] leading-snug font-sans cursor-pointer rounded-full transition-transform duration-150 ease-out will-change-transform active:scale-[0.97] flex items-center gap-1.5"
      aria-label="Copy email address"
    >
      <div className="relative flex items-center justify-center w-4 h-4">
        {/* Ícono original (Copiar) */}
        <div
          className={`absolute inset-0 transition-all duration-200 ${
            copied ? 'opacity-0 blur-sm scale-75' : 'opacity-100 blur-0 scale-100'
          }`}
          style={{ transformOrigin: 'center' }}
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#171717">
            <path d="M2.341 6.389C2.162 6.814 2.084 7.265 2.044 7.748C2 8.289 2 8.954 2 9.759V14.241C2 15.046 2 15.711 2.044 16.252C2.09 16.814 2.189 17.331 2.436 17.816C2.819 18.569 3.431 19.18 4.184 19.564C4.669 19.811 5.186 19.91 5.748 19.956C6.289 20 6.954 20 7.759 20H16.241C17.046 20 17.711 20 18.252 19.956C18.814 19.91 19.331 19.811 19.816 19.564C20.569 19.18 21.18 18.569 21.564 17.816C21.811 17.331 21.91 16.814 21.956 16.252C22 15.711 22 15.046 22 14.241V9.759C22 8.954 22 8.289 21.956 7.748C21.916 7.265 21.838 6.814 21.659 6.389L14.533 12.22C13.059 13.425 10.941 13.425 9.467 12.22L2.341 6.389Z" fill="currentColor" />
            <path d="M20.422 4.817C20.233 4.673 20.03 4.545 19.816 4.436C19.331 4.189 18.814 4.09 18.252 4.044C17.711 4 17.046 4 16.241 4H7.759C6.954 4 6.289 4 5.748 4.044C5.186 4.09 4.669 4.189 4.184 4.436C3.97 4.545 3.767 4.673 3.578 4.817L10.733 10.672C11.47 11.274 12.53 11.274 13.267 10.672L20.422 4.817Z" fill="currentColor" />
          </svg>
        </div>

        {/* Ícono nuevo (Confirmación / Check) - Exacto al que pediste */}
        <div
          className={`absolute inset-0 transition-all duration-200 ${
            copied ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-75'
          }`}
          style={{ transformOrigin: 'center' }}
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#171717">
            <path fillRule="evenodd" clipRule="evenodd" d="M19.3209 4.24472C20.0143 4.69807 20.2088 5.62768 19.7555 6.32105L11.2555 19.321C10.9972 19.7161 10.5681 19.9665 10.0971 19.997C9.62616 20.0276 9.16828 19.8347 8.86114 19.4764L4.36114 14.2264C3.82201 13.5974 3.89485 12.6504 4.52384 12.1113C5.15283 11.5722 6.09978 11.645 6.63891 12.274L9.83828 16.0066L17.2446 4.6793C17.6979 3.98593 18.6275 3.79136 19.3209 4.24472Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>
      <span className="font-medium shrink-0 leading-snug text-[14px]">
        {copied ? '¡Copiado!' : 'Copiar'}
      </span>
    </button>
  );
}
