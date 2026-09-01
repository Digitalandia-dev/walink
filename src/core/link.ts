import type { WaLinkConfig } from "../types";
import { sanitizePhone } from "./phone";

/**
 * Crea el enlace de WhatsApp a partir del numero y mensaje dados
 * @param options - Opciones de configuración del enlace
 * @returns El enlace de WhatsApp
 */
export function createWaLink(options: WaLinkConfig): string {
  const { phone, text, scheme = "wa.me", defaultCountryCode, strict = false } = options;

  // Limpiar el numero de telefono
  const { fullNumber } = sanitizePhone(phone, { defaultCountryCode, strict });

  // codificar texto
  const encodedText = text ? encodeURIComponent(text) : "";

  // Construir el enlace dependiendo del esquema
  switch (scheme) {
    case "wa.me":
      return `https://wa.me/${fullNumber}${encodedText ? `?text=${encodedText}` : ""}`;
    case "api.whatsapp.com":
      return `https://api.whatsapp.com/send?phone=${fullNumber}${encodedText ? `&text=${encodedText}` : ""}`;
    case "whatsapp://send":
      return `whatsapp://send?phone=${fullNumber}${encodedText ? `&text=${encodedText}` : ""}`;
  }
}
