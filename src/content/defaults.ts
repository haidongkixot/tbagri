import type { SiteContent } from "./types";

/**
 * Nội dung mặc định — chép từ file thiết kế (tiếng Tây Ban Nha), đã sửa lỗi chính tả,
 * kèm bản tiếng Anh. Các mục đánh dấu `// MẪU` là nội dung giả định để lấp chỗ trống
 * của slider/accordion trong thiết kế: TBAgri cần duyệt hoặc thay trong trang quản trị.
 */
const img = (src: string, es: string, en: string) => ({ src, alt: { es, en } });

export const defaultContent: SiteContent = {
  settings: {
    companyName: { es: "TB Agri Agriculture Corporation", en: "TB Agri Agriculture Corporation" },
    // "\n" = xuống dòng ở footer (thiết kế ngắt 3 dòng)
    address: {
      es: "Calle 32, #308, entre 3ra y 5ta,\nMiramar, municipio Playa,\nLa Habana, Cuba",
      en: "Calle 32, #308, between 3ra and 5ta,\nMiramar, Playa municipality,\nHavana, Cuba",
    },
    email: "tbagri@thaibinh.com.vn",
    phone: "+53 5050 9999",
    whatsapp: "5350509999",
    facebook: "",
    seoTitle: {
      es: "TB Agri — Del campo al mercado | Soluciones integrales para el arroz en Cuba",
      en: "TB Agri — From field to market | Integrated rice solutions in Cuba",
    },
    seoDescription: {
      es: "TB Agri acompaña a productores, cooperativas y entidades estatales cubanas con semillas, insumos, mecanización, poscosecha y tecnología digital para un desarrollo arrocero sostenible.",
      en: "TB Agri supports Cuban farmers, cooperatives and state entities with seeds, inputs, mechanization, post-harvest and digital technology for sustainable rice development.",
    },
  },

  hero: {
    title: { es: "Del campo al mercado", en: "From field to market" },
    subtitle: {
      es: "Junto a los productores por un desarrollo arrocero sostenible",
      en: "Alongside producers for sustainable rice development",
    },
    background: img(
      "/images/hero-bg.webp",
      "Campo de arroz maduro con cosechadora y fotos del ciclo del cultivo",
      "Ripe rice field with a harvester and photos of the crop cycle",
    ),
  },

  intro: {
    heading: {
      es: "TBAgri es un socio estratégico en el desarrollo del sector arrocero cubano",
      en: "TBAgri is a strategic partner in the development of Cuba’s rice sector",
    },
    paragraphs: [
      {
        es: "Participa directamente en la producción y ofrece soluciones integrales para toda la cadena de valor del arroz.",
        en: "It takes part directly in production and offers integrated solutions for the entire rice value chain.",
      },
      {
        es: "Acompaña a entidades estatales, cooperativas y productores con tecnología, insumos, mecanización y servicios técnicos para aumentar la productividad, reducir costos y avanzar hacia una agricultura sostenible y una mayor soberanía alimentaria.",
        en: "It supports state entities, cooperatives and farmers with technology, inputs, mechanization and technical services to raise productivity, lower costs and move towards sustainable agriculture and greater food sovereignty.",
      },
    ],
    partnerTitle: {
      es: "Un solo socio – soluciones completas",
      en: "One partner – complete solutions",
    },
    partnerText: {
      es: "Insumos, maquinaria, técnica, tecnología y conexión comercial adaptadas a las condiciones de Cuba",
      en: "Inputs, machinery, know-how, technology and market access adapted to Cuban conditions",
    },
  },

  audiences: [
    {
      label: { es: "Dirigido a\nagricultores", en: "For\nfarmers" },
      image: img(
        "/images/intro-audience-1.webp",
        "Agricultores cubanos en un campo de arroz",
        "Cuban farmers in a rice field",
      ),
      icon: "/images/icon-audience-1.png",
    },
    {
      label: { es: "Dirigido a\nautoridades", en: "For\nauthorities" },
      image: img(
        "/images/intro-audience-2.webp",
        "Visita de autoridades a un campo de arroz",
        "Authorities visiting a rice field",
      ),
      icon: "/images/icon-audience-2.png",
    },
    {
      // Thiết kế ghi "Para empresas y socios que buscan" (câu chưa hết) — cần TBAgri xác nhận.
      label: {
        es: "Para empresas y\nsocios que buscan",
        en: "For companies and\npartners seeking",
      },
      image: img(
        "/images/intro-audience-3.webp",
        "Cosechadora y dron trabajando en el campo",
        "Harvester and drone working in the field",
      ),
      icon: "/images/icon-audience-3.png",
    },
  ],

  cycle: {
    title: { es: "Solución integral", en: "Integrated solution" },
    startLabel: { es: "Inicio de ciclo", en: "Cycle start" },
    centerTitle: { es: "Recorrido del cultivo de arroz", en: "The rice crop journey" },
    centerText: {
      es: "El sistema de soluciones de TB Agri cubre todo el ciclo",
      en: "TB Agri’s solutions cover the entire cycle",
    },
  },
  cycleSteps: [
    {
      label: { es: "Diagnóstico del suelo", en: "Soil diagnosis" },
      icon: "/images/icon-cycle-01.png",
    },
    {
      label: { es: "Selección de semilla", en: "Seed selection" },
      icon: "/images/icon-cycle-02.png",
    },
    {
      label: { es: "Preparación del terreno", en: "Land preparation" },
      icon: "/images/icon-cycle-03.png",
    },
    { label: { es: "Siembra", en: "Sowing" }, icon: "/images/icon-cycle-04.png" },
    { label: { es: "Fertilización", en: "Fertilization" }, icon: "/images/icon-cycle-05.png" },
    {
      label: { es: "Manejo fitosanitario", en: "Crop protection" },
      icon: "/images/icon-cycle-06.png",
    },
    { label: { es: "Agua", en: "Water" }, icon: "/images/icon-cycle-07.png" },
    { label: { es: "Cosecha", en: "Harvest" }, icon: "/images/icon-cycle-08.png" },
    { label: { es: "Secado", en: "Drying" }, icon: "/images/icon-cycle-09.png" },
    { label: { es: "Molienda", en: "Milling" }, icon: "/images/icon-cycle-10.png" },
    { label: { es: "Empaque", en: "Packaging" }, icon: "/images/icon-cycle-11.png" },
    {
      label: { es: "Conexión al mercado", en: "Market access" },
      icon: "/images/icon-cycle-12.png",
    },
  ],

  philosophy: {
    title: { es: "Filosofía de implementación", en: "Implementation philosophy" },
    text: {
      es: "Ofrece soluciones integrales que combinan productos y servicios para los campos cubanos, con capacitación, seguimiento y mejora continua tras cada campaña agrícola.",
      en: "We offer integrated solutions that combine products and services for Cuban fields, with training, follow-up and continuous improvement after every growing season.",
    },
  },
  philosophySlides: [
    {
      label: { es: "Capacitación", en: "Training" },
      image: img(
        "/images/philosophy-1.webp",
        "Sesión de capacitación técnica",
        "Technical training session",
      ),
    },
    {
      label: { es: "Orientación", en: "Guidance" },
      image: img(
        "/images/philosophy-2.webp",
        "Técnicos orientando a productores",
        "Technicians guiding farmers",
      ),
    },
    {
      label: { es: "Seguimiento", en: "Follow-up" },
      image: img(
        "/images/philosophy-3.webp",
        "Seguimiento de plántulas en el campo",
        "Seedling follow-up in the field",
      ),
    },
  ],

  serviceModel: {
    title: { es: "Modelo de servicio", en: "Service model" },
    banner: img(
      "/images/products-banner.webp",
      "Productos TB Agri y TB Food sobre un campo de arroz",
      "TB Agri and TB Food products over a rice field",
    ),
  },
  services: [
    { label: { es: "Insumos", en: "Inputs" }, icon: "/images/icon-service-1.png" },
    { label: { es: "Maquinaria", en: "Machinery" }, icon: "/images/icon-service-2.png" },
    { label: { es: "Poscosecha", en: "Post-harvest" }, icon: "/images/icon-service-3.png" },
    { label: { es: "Digitalización", en: "Digitalization" }, icon: "/images/icon-service-4.png" },
    {
      label: { es: "Asistencia técnica", en: "Technical assistance" },
      icon: "/images/icon-service-5.png",
    },
    {
      label: { es: "Paquete integral por campaña", en: "Full package per season" },
      icon: "/images/icon-service-6.png",
    },
  ],

  productGroups: {
    title: { es: "Grupo de productos y servicios", en: "Products and services" },
    ctaLabel: {
      es: "Contáctenos para una consulta y un presupuesto",
      en: "Contact us for advice and a quote",
    },
  },
  productSlides: [
    {
      title: { es: "Semillas de arroz", en: "Rice seeds" },
      description: {
        es: "Gama de semillas de arroz: variedades de ciclo corto y medio, de alta calidad, aptas para la agricultura mecanizada y adaptadas al calendario agrícola.",
        en: "A range of rice seeds: short- and medium-cycle, high-quality varieties suited to mechanized farming and adapted to the crop calendar.",
      },
      image: img(
        "/images/products-hands.webp",
        "Manos sosteniendo semillas de arroz",
        "Hands holding rice seeds",
      ),
    },
    {
      // MẪU
      title: { es: "Fertilizantes", en: "Fertilizers" },
      description: {
        es: "Fertilizantes compuestos NPK y foliares formulados para el arroz, con planes de fertilización por etapa del cultivo.",
        en: "Compound NPK and foliar fertilizers formulated for rice, with fertilization plans for each crop stage.",
      },
      image: img(
        "/images/pack-npk.webp",
        "Saco de fertilizante compuesto NPK",
        "Bag of NPK compound fertilizer",
      ),
      fit: "contain",
    },
    {
      // MẪU
      title: { es: "Protección de cultivos", en: "Crop protection" },
      description: {
        es: "Productos fitosanitarios para el control de plagas, enfermedades y malezas, con recomendaciones de uso seguro.",
        en: "Crop protection products to control pests, diseases and weeds, with safe-use recommendations.",
      },
      image: img(
        "/images/pack-agroquimicos.webp",
        "Productos fitosanitarios",
        "Crop protection products",
      ),
      fit: "contain",
    },
    {
      // MẪU
      title: { es: "Maquinaria agrícola", en: "Farm machinery" },
      description: {
        es: "Tractores, sembradoras, cosechadoras y equipos de apoyo para mecanizar cada etapa de la campaña.",
        en: "Tractors, planters, harvesters and support equipment to mechanize every stage of the season.",
      },
      image: img(
        "/images/machinery-1.webp",
        "Tractor preparando un campo inundado",
        "Tractor preparing a flooded field",
      ),
    },
    {
      // MẪU
      title: { es: "Soluciones de poscosecha", en: "Post-harvest solutions" },
      description: {
        es: "Secado, molienda, empaque y almacenamiento para obtener arroz comercial de calidad.",
        en: "Drying, milling, packaging and storage to obtain quality commercial rice.",
      },
      image: img(
        "/images/drying-grain.webp",
        "Arroz cayendo en una planta de secado",
        "Rice pouring in a drying plant",
      ),
    },
    {
      // MẪU
      title: { es: "Arroz comercial TB Food", en: "TB Food commercial rice" },
      description: {
        es: "Arroz blanco vietnamita cultivado en Cuba, empacado para la distribución.",
        en: "Vietnamese white rice grown in Cuba, packed for distribution.",
      },
      image: img(
        "/images/pack-arroz-blanco.webp",
        "Sacos de arroz blanco TB Food",
        "TB Food white rice bags",
      ),
      fit: "contain",
    },
  ],

  seedsInputs: { title: { es: "Semillas e insumos", en: "Seeds and inputs" } },
  inputSlides: [
    {
      title: { es: "Soluciones de manejo de insectos", en: "Insect management solutions" },
      description: {
        es: "Antes/después de la siembra, bajo el principio de momento correcto, condición del campo adecuada y orientación técnica aprobada.",
        en: "Before and after sowing, following the principle of the right moment, suitable field conditions and approved technical guidance.",
      },
      image: img(
        "/images/inputs-illustration.webp",
        "Ilustración de una mano sembrando una plántula de arroz",
        "Illustration of a hand planting a rice seedling",
      ),
    },
    {
      // MẪU
      title: { es: "Semilla certificada", en: "Certified seed" },
      description: {
        es: "Variedades como OM5451, con alto porcentaje de germinación y pureza varietal, listas para la siembra mecanizada.",
        en: "Varieties such as OM5451, with high germination and varietal purity, ready for mechanized sowing.",
      },
      image: img(
        "/images/pack-om5451.webp",
        "Saco de semilla de arroz OM5451",
        "Bag of OM5451 rice seed",
      ),
      fit: "contain",
    },
    {
      // MẪU
      title: { es: "Nutrición del cultivo", en: "Crop nutrition" },
      description: {
        es: "Planes de fertilización según el análisis de suelo y la etapa del cultivo para mejorar el rendimiento.",
        en: "Fertilization plans based on soil analysis and crop stage to improve yield.",
      },
      image: img("/images/pack-npk.webp", "Saco de fertilizante NPK", "Bag of NPK fertilizer"),
      fit: "contain",
    },
    {
      // MẪU
      title: { es: "Manejo de malezas", en: "Weed management" },
      description: {
        es: "Control integrado de malezas con productos registrados y prácticas culturales adecuadas a cada zona.",
        en: "Integrated weed control with registered products and cultural practices suited to each area.",
      },
      image: img(
        "/images/pack-agroquimicos.webp",
        "Productos para el manejo de malezas",
        "Weed management products",
      ),
      fit: "contain",
    },
    {
      // MẪU
      title: { es: "Acompañamiento técnico", en: "Technical support" },
      description: {
        es: "Visitas de campo y recomendaciones de aplicación para usar cada insumo en el momento correcto.",
        en: "Field visits and application advice to use each input at the right time.",
      },
      image: img(
        "/images/philosophy-3.webp",
        "Técnico revisando plántulas",
        "Technician checking seedlings",
      ),
    },
  ],

  machinery: {
    title: { es: "Mecanización agrícola", en: "Farm mechanization" },
    ctaLabel: {
      es: "Contáctenos para una consulta y un presupuesto",
      en: "Contact us for advice and a quote",
    },
  },
  machines: [
    {
      title: { es: "Maquinaria para preparación del terreno", en: "Land preparation machinery" },
      description: {
        es: "Tractores, arados, rastras, nivelación y equipos de mejora del campo. Objetivo: superficie uniforme, siembra eficiente y mejor manejo del agua.",
        en: "Tractors, ploughs, harrows, levelling and field improvement equipment. Goal: an even surface, efficient sowing and better water management.",
      },
      image: img(
        "/images/machinery-1.webp",
        "Tractor con rueda de jaula en un campo inundado",
        "Tractor with cage wheels in a flooded field",
      ),
    },
    {
      title: { es: "Equipos de siembra", en: "Sowing equipment" },
      description: {
        es: "Sembradoras, herramientas de distribución uniforme de semilla, apoyo para controlar densidad y ahorrar semilla según condiciones locales.",
        en: "Planters and tools for even seed distribution, helping control density and save seed according to local conditions.",
      },
      image: img(
        "/images/machinery-2.webp",
        "Sembradora trabajando en el campo",
        "Planter working in the field",
      ),
    },
    {
      title: { es: "Equipos de cuidado del cultivo", en: "Crop care equipment" },
      description: {
        es: "Tractores pequeños, desmalezado mecánico, bombas de agua, transporte interno y herramientas para inspección de campo.",
        en: "Small tractors, mechanical weeding, water pumps, on-farm transport and field inspection tools.",
      },
      image: img(
        "/images/machinery-3.webp",
        "Tractor pulverizando el cultivo",
        "Tractor spraying the crop",
      ),
    },
    {
      // MẪU
      title: { es: "Equipos de cosecha", en: "Harvesting equipment" },
      description: {
        es: "Cosechadoras combinadas y apoyo logístico para cosechar a tiempo y reducir pérdidas.",
        en: "Combine harvesters and logistics support to harvest on time and reduce losses.",
      },
      image: img(
        "/images/intro-audience-3.webp",
        "Cosechadora en un campo de arroz maduro",
        "Harvester in a ripe rice field",
      ),
    },
  ],

  postHarvest: {
    title: {
      es: "Procesamiento posterior a la cosecha para obtener productos comerciales",
      en: "Post-harvest processing to obtain commercial products",
    },
  },
  postHarvestSteps: [
    {
      label: { es: "Cosecha", en: "Harvest" },
      image: img("/images/postharvest-1.webp", "Cosechadora y camión", "Harvester and truck"),
    },
    {
      label: { es: "Transporte\nal almacén", en: "Transport to\nthe warehouse" },
      image: img(
        "/images/postharvest-2.webp",
        "Camión llegando al almacén",
        "Truck arriving at the warehouse",
      ),
    },
    {
      label: { es: "Cribado\ny limpieza", en: "Screening\nand cleaning" },
      image: img("/images/postharvest-3.webp", "Máquina de cribado", "Screening machine"),
    },
    {
      label: { es: "Secado", en: "Drying" },
      image: img("/images/postharvest-4.webp", "Secadora de grano", "Grain dryer"),
    },
    {
      label: { es: "Descascarillado\ndel arroz", en: "Rice\nhulling" },
      image: img("/images/postharvest-5.webp", "Descascarilladora", "Huller"),
    },
    {
      label: { es: "Pulido de los\ngranos de arroz", en: "Rice grain\npolishing" },
      image: img("/images/postharvest-6.webp", "Pulidora de arroz", "Rice polisher"),
    },
    {
      label: { es: "Envasado", en: "Packing" },
      image: img("/images/postharvest-7.webp", "Envasadora", "Packing machine"),
    },
    {
      label: { es: "Distribución", en: "Distribution" },
      image: img(
        "/images/postharvest-8.webp",
        "Sacos de arroz listos para distribuir",
        "Rice bags ready for distribution",
      ),
    },
  ],
  dryingSolutions: [
    {
      label: { es: "Soluciones de secado", en: "Drying solutions" },
      description: {
        es: "Recepción de arroz fresco, limpieza preliminar, secado controlado, reducción de deterioro poscosecha y estabilización de calidad para molienda.",
        en: "Fresh paddy intake, pre-cleaning, controlled drying, reduced post-harvest losses and quality stabilization before milling.",
      },
      image: img(
        "/images/drying-grain.webp",
        "Grano cayendo en la planta de secado",
        "Grain falling in the drying plant",
      ),
    },
    {
      // MẪU
      label: { es: "Soluciones de empaque", en: "Packaging solutions" },
      description: {
        es: "Envasado en sacos y bolsas de distintos formatos, con control de peso, sellado y trazabilidad por lote.",
        en: "Packing in sacks and bags of different sizes, with weight control, sealing and lot traceability.",
      },
      image: img("/images/pack-arroz-blanco.webp", "Sacos de arroz envasado", "Packed rice bags"),
      fit: "contain",
    },
    {
      // MẪU
      label: { es: "Soluciones de molienda", en: "Milling solutions" },
      description: {
        es: "Descascarillado, pulido y clasificación del grano para obtener arroz blanco de calidad comercial.",
        en: "Hulling, polishing and grading to obtain commercial-quality white rice.",
      },
      image: img(
        "/images/postharvest-6.webp",
        "Equipo de molienda de arroz",
        "Rice milling equipment",
      ),
    },
    {
      // MẪU
      label: { es: "Organización de almacenes", en: "Warehouse organization" },
      description: {
        es: "Almacenamiento ordenado, control de humedad y plagas, y gestión de inventario por lote.",
        en: "Orderly storage, moisture and pest control, and inventory management by lot.",
      },
      image: img("/images/postharvest-2.webp", "Almacén de arroz", "Rice warehouse"),
    },
  ],

  digital: {
    title: {
      es: "TB Agri incorpora tecnologías digitales y soluciones innovadoras",
      en: "TB Agri brings digital technologies and innovative solutions",
    },
    subtitle: { es: "Incorporar el grupo de digitalización", en: "Our digitalization toolkit" },
    text: {
      es: "Sensores de campo, monitoreo de agua/humedad, bitácora agrícola, alertas de campaña, datos operativos y plataforma de apoyo a decisiones.",
      en: "Field sensors, water/moisture monitoring, a farm logbook, season alerts, operational data and a decision-support platform.",
    },
    image: img(
      "/images/digital-farmer.webp",
      "Productor de TB Agri usando un teléfono en el campo",
      "TB Agri farmer using a phone in the field",
    ),
  },
  digitalFeatures: [
    {
      title: { es: "Aplicación de manejo inteligente", en: "Smart management app" },
      description: {
        es: "Para gestionar el riego mediante alternancia de inundación y sequía en el cultivo del arroz, facilitando el monitoreo del campo y la toma de decisiones sobre el uso del agua según recomendaciones técnicas.",
        en: "To manage irrigation through alternate wetting and drying in rice, making field monitoring and water-use decisions easier according to technical recommendations.",
      },
      icon: "/images/icon-digital-1.png",
    },
    {
      title: { es: "Desarrollar bitácora digital de campaña", en: "Digital season logbook" },
      description: {
        es: "Siembra, fertilización, manejo, riesgos, fotos de campo, rendimiento y costos por lote.",
        en: "Sowing, fertilization, crop care, risks, field photos, yield and costs per plot.",
      },
      icon: "/images/icon-digital-2.png",
    },
    {
      // Thiết kế ghi "TRANSFERENCIA TÉCNICA MEDIANTE" — cần TBAgri xác nhận tiêu đề đầy đủ.
      title: { es: "Transferencia técnica", en: "Technical transfer" },
      description: {
        es: "Procedimiento operativo estándar, capacitación en campo, guía de operación de maquinaria, talleres por campaña, evaluación poscosecha y mejora continua.",
        en: "Standard operating procedures, field training, machinery operation guides, seasonal workshops, post-harvest evaluation and continuous improvement.",
      },
      icon: "/images/icon-digital-1.png",
    },
    {
      // Câu cuối trong thiết kế bị cắt ("reportar con transparencia a") — đã hoàn thiện, cần duyệt.
      title: { es: "Los datos digitales permiten", en: "Digital data makes it possible to" },
      description: {
        es: "Monitorear zonas productivas, gestionar insumos, coordinar maquinaria, controlar el avance de la campaña y reportar con transparencia a las autoridades y socios.",
        en: "Monitor production areas, manage inputs, coordinate machinery, track season progress and report transparently to authorities and partners.",
      },
      icon: "/images/icon-digital-2.png",
    },
  ],

  benefits: { title: { es: "Beneficio y contacto", en: "Benefits and contact" } },
  benefitItems: [
    {
      title: { es: "Para los agricultores", en: "For farmers" },
      description: {
        es: "Acceso a insumos adecuados, maquinaria oportuna, técnicas aplicables, menor riesgo de campaña y mayor eficiencia productiva.",
        en: "Access to the right inputs, timely machinery, practical techniques, lower season risk and higher productivity.",
      },
    },
    {
      // MẪU — thiết kế lặp lại "PARA LAS AUTORIDADES" ba lần.
      title: { es: "Para las autoridades", en: "For authorities" },
      description: {
        es: "Datos de campaña confiables, mayor producción nacional de arroz y apoyo a la soberanía alimentaria.",
        en: "Reliable season data, higher national rice output and support for food sovereignty.",
      },
    },
    {
      // MẪU
      title: { es: "Para las cooperativas", en: "For cooperatives" },
      description: {
        es: "Paquetes integrales por campaña, asistencia técnica continua y acceso a la mecanización.",
        en: "Full seasonal packages, ongoing technical assistance and access to mechanization.",
      },
    },
    {
      // MẪU
      title: { es: "Para empresas y socios", en: "For companies and partners" },
      description: {
        es: "Un socio local con operación integral y modelos de colaboración adaptados a cada zona productiva.",
        en: "A local partner with end-to-end operations and collaboration models adapted to each production area.",
      },
    },
  ],

  contact: {
    title: { es: "Hablemos de su campaña", en: "Let’s talk about your season" },
    intro: {
      es: "Déjenos sus datos y un especialista de TB Agri le contactará en un plazo de dos días hábiles.",
      en: "Leave your details and a TB Agri specialist will contact you within two business days.",
    },
  },

  invitation: {
    title: { es: "Invitación a colaborar", en: "An invitation to collaborate" },
    text: {
      es: "TB Agri está listo para colaborar con agricultores, cooperativas, empresas y entidades estatales cubanas para diseñar modelos arroceros adaptados a cada zona productiva.",
      en: "TB Agri is ready to work with Cuban farmers, cooperatives, companies and state entities to design rice-growing models adapted to each production area.",
    },
    ctaLabel: { es: "Contáctenos ahora", en: "Contact us now" },
  },

  footerLinks: [
    { label: { es: "Empleo", en: "Careers" }, href: "" },
    { label: { es: "Noticias y blog", en: "News & Blog" }, href: "" },
    { label: { es: "Sostenibilidad y gobernanza", en: "Sustainability & Governance" }, href: "" },
    { label: { es: "Centro de prensa", en: "Press Center" }, href: "" },
    { label: { es: "Publicidad", en: "Advertise with Us" }, href: "" },
    { label: { es: "Afiliados y socios", en: "Affiliates & Partners" }, href: "" },
    { label: { es: "Proveedores", en: "Suppliers" }, href: "" },
  ],

  stores: [
    {
      name: { es: "Oficina TB Agri La Habana", en: "TB Agri Havana office" },
      address: {
        es: "Calle 32, #308, entre 3ra y 5ta, Miramar, municipio Playa, La Habana, Cuba",
        en: "Calle 32, #308, between 3ra and 5ta, Miramar, Playa municipality, Havana, Cuba",
      },
      phone: "+53 5050 9999",
      hours: { es: "Lunes a viernes, 8:00–17:00", en: "Monday to Friday, 8:00–17:00" }, // MẪU
      mapUrl:
        "https://www.openstreetmap.org/search?query=Calle%2032%20308%20Miramar%20Playa%20La%20Habana",
    },
  ],
};
