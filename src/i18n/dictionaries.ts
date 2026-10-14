import type { Locale } from "@/content/types";

/**
 * Chuỗi giao diện cố định (menu, nút, nhãn form…). Nội dung marketing nằm trong
 * src/content và được sửa qua trang quản trị; chuỗi giao diện thì sửa ở đây.
 */
const es = {
  nav: {
    home: "Inicio",
    about: "Introducción",
    products: "Productos",
    stores: "Nuestras tiendas",
    contact: "Contacto",
  },
  a11y: {
    skip: "Saltar al contenido",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    previous: "Anterior",
    next: "Siguiente",
    goToSlide: "Ir a la diapositiva",
    switchTo: "Ver en inglés",
    mainNav: "Navegación principal",
  },
  floatingContact: "Contáctanos",
  form: {
    name: "Nombre y apellidos",
    organization: "Organización",
    segment: "Usted es",
    segments: {
      agricultor: "Agricultor",
      cooperativa: "Cooperativa",
      autoridad: "Autoridad",
      empresa: "Empresa o socio",
      otro: "Otro",
    },
    email: "Correo electrónico",
    phone: "Teléfono",
    interest: "Interés principal",
    interests: {
      insumos: "Insumos",
      maquinaria: "Maquinaria",
      poscosecha: "Poscosecha",
      digitalizacion: "Digitalización",
      asistencia: "Asistencia técnica",
      paquete: "Paquete integral por campaña",
    },
    message: "Mensaje",
    consent: "Acepto que TB Agri use estos datos para responder a mi solicitud.",
    submit: "Enviar solicitud",
    sending: "Enviando…",
    optional: "opcional",
    success: "¡Gracias! Hemos recibido su solicitud y le contactaremos pronto.",
    errors: {
      generic: "No pudimos enviar su solicitud. Revise los campos marcados e inténtelo de nuevo.",
      rateLimited: "Ha enviado varias solicitudes seguidas. Inténtelo de nuevo en unos minutos.",
      required: "Este campo es obligatorio.",
      email: "Escriba un correo electrónico válido.",
      tooShort: "Escriba al menos 10 caracteres.",
      tooLong: "El texto es demasiado largo.",
      consent: "Debe aceptar para poder enviar.",
      phone: "Escriba un teléfono válido.",
    },
  },
  footer: {
    contactTitle: "Contáctenos",
    aboutTitle: "Acerca de TBAgri",
    rights: "Todos los derechos reservados.",
    whatsapp: "Escríbanos por WhatsApp",
    facebook: "Síganos en Facebook",
  },
  stores: {
    title: "Nuestras tiendas",
    intro:
      "Visítenos o llámenos: le orientamos sobre insumos, maquinaria y servicios para su campaña.",
    hours: "Horario",
    phone: "Teléfono",
    map: "Ver en el mapa",
    back: "Volver al inicio",
  },
  notFound: {
    title: "Página no encontrada",
    text: "La página que busca no existe o ha cambiado de dirección.",
    back: "Volver al inicio",
  },
};

export type Dictionary = typeof es;

const en: Dictionary = {
  nav: {
    home: "Home",
    about: "About",
    products: "Products",
    stores: "Our stores",
    contact: "Contact",
  },
  a11y: {
    skip: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    previous: "Previous",
    next: "Next",
    goToSlide: "Go to slide",
    switchTo: "View in Spanish",
    mainNav: "Main navigation",
  },
  floatingContact: "Contact us",
  form: {
    name: "Full name",
    organization: "Organization",
    segment: "You are",
    segments: {
      agricultor: "Farmer",
      cooperativa: "Cooperative",
      autoridad: "Authority",
      empresa: "Company or partner",
      otro: "Other",
    },
    email: "Email",
    phone: "Phone",
    interest: "Main interest",
    interests: {
      insumos: "Inputs",
      maquinaria: "Machinery",
      poscosecha: "Post-harvest",
      digitalizacion: "Digitalization",
      asistencia: "Technical assistance",
      paquete: "Full package per season",
    },
    message: "Message",
    consent: "I agree that TB Agri may use this information to reply to my request.",
    submit: "Send request",
    sending: "Sending…",
    optional: "optional",
    success: "Thank you! We have received your request and will contact you soon.",
    errors: {
      generic: "We couldn’t send your request. Check the highlighted fields and try again.",
      rateLimited: "You have sent several requests in a row. Please try again in a few minutes.",
      required: "This field is required.",
      email: "Enter a valid email address.",
      tooShort: "Write at least 10 characters.",
      tooLong: "The text is too long.",
      consent: "You need to agree before sending.",
      phone: "Enter a valid phone number.",
    },
  },
  footer: {
    contactTitle: "Contact us",
    aboutTitle: "About TBAgri",
    rights: "All rights reserved.",
    whatsapp: "Message us on WhatsApp",
    facebook: "Follow us on Facebook",
  },
  stores: {
    title: "Our stores",
    intro: "Visit or call us: we’ll advise you on inputs, machinery and services for your season.",
    hours: "Opening hours",
    phone: "Phone",
    map: "View on map",
    back: "Back to home",
  },
  notFound: {
    title: "Page not found",
    text: "The page you are looking for doesn’t exist or has moved.",
    back: "Back to home",
  },
};

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
