export interface CaseStudySection {
  title?: string;
  description?: string;
  image?: string;
  images?: string[];
  type: 'hero' | 'tech' | 'showcase';
}

export interface Project {
  slug: string;
  category: string;
  title: string;
  description: string;
  image: string;
  layout: "image-left" | "text-left";
  date?: string;
  techStack?: string[];
  link?: string;
  github?: string;
  caseStudy?: {
    intro: string;
    sections: CaseStudySection[];
  };
}

export const projectsData: Project[] = [
  {
    slug: "mio-web",
    category: "Frontend Development",
    title: "MIO WEB",
    description: "Diseñé e implementé una plataforma integral para salud digital enfocada en la experiencia del usuario. Desarrollé paneles de control dinámicos y métricas clínicas, utilizando un sistema de diseño propio para mantener una interfaz coherente, escalable y centrada en los datos.",
    image: "/MIO-LP.png",
    layout: "image-left",
    date: "01.2026",
    techStack: ["Vue 3", "TypeScript", "TailwindCSS"],
    link: "https://mioweb.com",
    github: "https://github.com/example/mioweb",
    caseStudy: {
      intro: "Mio Web se mueve rápido. Los requerimientos pueden ajustarse y hay poco margen para la inconsistencia. Sin una estructura sólida, entregar interfaces de alta calidad a ese ritmo se vuelve riesgoso. Como líder frontend, construí el sistema de diseño para darle al proyecto una base firme bajo presión y agilizar la creación de nuevas vistas sin perder coherencia.",
      sections: [
        {
          title: "Dashboard: El corazón de los datos.",
          description: "Aplicando el sistema de diseño, creamos un panel de métricas críticas. Tarjetas modulares y gráficos simples que permiten al paciente ver su progreso histórico, reduciendo la carga cognitiva y facilitando decisiones de salud.",
          image: "/MIO-IMG1.png",
          type: 'showcase'
        },
        {
          title: "Layout y Sistema de Grillas.",
          description: "Definimos una estructura sólida para vistas complejas, como la autenticación. Separar la pantalla en áreas lógicas (una columna de branding oscura y una de acción clara con gradientes) asegura que el usuario no se pierda al iniciar sesión o completar su perfil médico.",
          image: "/EstructuraFrame.webp",
          type: 'showcase'
        },
        {
          title: "Fundamentos: Tipografía y Color.",
          description: "La base visual de MIO. Plus Jakarta Sans aporta carácter y legibilidad en los títulos (Display y Heading), mientras que Inter actúa como la columna vertebral para la lectura de datos médicos complejos. La paleta, centrada en tonos violetas vibrantes contrastados con fondos oscuros, define jerarquías claras sin ser abrumadora.",
          image: "/ComponentFrame.webp",
          type: 'showcase'
        },
        {
          title: "Métricas y Tarjetas Modulares.",
          description: "Desglosamos la información clínica en componentes independientes y visuales. El diseño atómico permite componer distintas vistas del dashboard sin repetir lógica ni estilos, garantizando jerarquía clara para métricas vitales, gráficos de evolución y títulos de sección en toda la plataforma.",
          images: [
            "/C-dash1.webp",
            "/C-dashH4.webp",
            "/C-dash3.webp"
          ],
          type: 'showcase'
        },
        {
          title: "Construido para el trabajo real.",
          description: "Me enfoqué en los componentes que realmente íbamos a reutilizar. Las variaciones en botones y estados fueron intencionales y limitadas para evitar la sobrecarga de opciones. Las convenciones de nombres se mantuvieron simples y predecibles para que cualquier desarrollador pudiera usarlas sin fricción.",
          image: "/componetsUI.png",
          type: 'showcase'
        },
        {
          title: "Diseñado para ser compartido.",
          description: "En un entorno dinámico, el valor del sistema se volvió obvio. Redujo el tiempo de diseño, mejoró la consistencia y facilitó el desarrollo de nuevas secciones. En lugar de repensar decisiones o dudar sobre qué variante usar, el sistema creó una línea base compartida que mantuvo a toda la interfaz alineada.",
          type: 'tech'
        }
      ]
    }
  },
  {
    slug: "fletes-marcelo",
    category: "Web Development",
    title: "Fletes Marcelo",
    description: "Sitio web de alto rendimiento desarrollado con Astro. Logré un puntaje de 100/100 en Google Lighthouse, asegurando que el negocio de transportes sea el primero en cargar para clientes potenciales.",
    image: "/FLETEM.png",
    layout: "image-left",
    date: "05.2025",
    techStack: ["Astro", "TailwindCSS", "Framer Motion"],
    link: "https://fletesdonmarcelo.netlify.app/",
    github: "https://github.com/example/fletes"
  },
  {
    slug: "portafolio-web",
    category: "Web Design & Dev",
    title: "Portafolio Web",
    description: "Mi Portafolio web es una aplicación diseñada para mostrar proyectos, servicios y datos de contacto de manera visual y atractiva, priorizando la performance y la accesibilidad.",
    image: "/porfolioa.png",
    layout: "text-left",
    date: "10.2025",
    techStack: ["Astro", "React", "Shadcn UI"],
    link: "https://portafolio-taupe-one-74.vercel.app/",
    github: "https://github.com/example/portfolio"
  },
  {
    slug: "agr-ecommerce",
    category: "E-Commerce",
    title: "AGR E-Commerce",
    description: "AGR es una aplicación e-commerce (Mockup) para conectar a agricultores con consumidores, ofreciendo una plataforma intuitiva para la compra y venta de productos agrícolas.",
    image: "/E-COMMER.png",
    layout: "image-left",
    date: "08.2025",
    techStack: ["Next.js", "Prisma", "PostgreSQL"],
    link: "https://proyecto-e-commerce-swart.vercel.app/",
    github: "https://github.com/example/agr"
  },
  {
    slug: "notichilec",
    category: "Mobile Application",
    title: "NotiChile©",
    description: "Aplicación móvil para el seguimiento de licitaciones públicas de Mercado Público (Chile). Permite a los proveedores encontrar oportunidades como Adquisición de equipos computacionales y Servicio de mantención.",
    image: "/images/projects/NotichileC/Mockup-APP-Notichle.webp",
    layout: "text-left",
    date: "04.2026",
    techStack: ["React Native", "Expo", "PostgreSQL", "Express"],
    caseStudy: {
      intro: "NotiChile© revoluciona el acceso a licitaciones públicas de Mercado Público. Centraliza oportunidades clave como la Adquisición de equipos computacionales y Servicio de mantención, permitiendo a los proveedores recibir notificaciones push en tiempo real y gestionar sus postulaciones directamente desde su dispositivo móvil.",
      sections: [
        {
          title: "Construyendo el MVP",
          description: "Del problema a la primera versión. En semanas. Sin perder calidad.",
          type: 'hero'
        },
        {
          title: "Frontend: React Native + Expo",
          description: "UI nativa con React Native y Expo. Componentes modulares, navegación fluida, y una base de código que escala sin fricción. TypeScript en cada archivo — tipo safety desde el día uno.",
          type: 'tech'
        },
        {
          title: "Backend: Express + PostgreSQL",
          description: "API REST con Express. PostgreSQL para datos estructurados: licitaciones, usuarios, alertas. Consultas optimizadas, respuesta en milisegundos.",
          type: 'tech'
        },
        {
          title: "Notificaciones Push en Tiempo Real",
          description: "WebSockets para comunicación bidireccional. El backend detecta nuevas licitaciones y empuja la alerta al dispositivo — sin polling, sin delay.",
          type: 'tech'
        },
        {
          title: "View Licitaciones",
          description: "Filtros instantáneos. Lista que respira. Solo lo esencial: qué, cuánto, cuándo.",
          image: "/images/projects/NotichileC/ui-licitaciones-Notichile-MVP.webp",
          type: 'showcase'
        },
        {
          title: "Settings",
          description: "Detalle limpio. Comprador, monto, fechas. Un CTA directo a Mercado Público.",
          image: "/images/projects/NotichileC/ui-settings-Notichilec.webp",
          type: 'showcase'
        },
        {
          title: "Home",
          description: "Sincronización confirmada. Alertas activas. El usuario sabe que está conectado.",
          image: "/images/projects/NotichileC/ui-feed-Notichilec.webp",
          type: 'showcase'
        }
      ]
    }
  }
];
