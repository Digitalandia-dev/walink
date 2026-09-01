import type { ParseWaLinkResult, WaLinkConfig } from "../types";
import { sanitizePhone } from "./phone";

/**
 * Crea el enlace de WhatsApp a partir del numero y mensaje dados.
 *
 * @param options - Opciones de configuracion del enlace.
 * @returns El enlace de WhatsApp formateado y codificado.
 */
export function createWaLink(options: WaLinkConfig): string {
  const { phone, text, scheme = "wa.me", defaultCountryCode, strict = false } = options;

  // Limpiar el numero de telefono
  const { fullNumber } = sanitizePhone(phone, { defaultCountryCode, strict });

  // Codificar texto
  const encodedText = text ? encodeURIComponent(text) : "";

  // Construir el enlace dependiendo del esquema
  switch (scheme) {
    case "wa.me":
      return `https://wa.me/${fullNumber}${encodedText ? `?text=${encodedText}` : ""}`;
    case "api.whatsapp.com":
      return `https://api.whatsapp.com/send?phone=${fullNumber}${encodedText ? `&text=${encodedText}` : ""}`;
    case "whatsapp://send":
      return `whatsapp://send?phone=${fullNumber}${encodedText ? `&text=${encodedText}` : ""}`;
    default:
      return `https://wa.me/${fullNumber}${encodedText ? `?text=${encodedText}` : ""}`;
  }
}

/**
 * Analiza y descompone una URL existente de WhatsApp extrayendo el telefono, mensaje y esquema.
 *
 * @param url - Enlace de WhatsApp en formato wa.me, api.whatsapp.com o whatsapp://send.
 * @returns Objeto con el telefono sanitizado, el texto decodificado y el esquema identificado.
 */
export function parseWaLink(url: string): ParseWaLinkResult {
  try {
    if (url.startsWith("whatsapp://send")) {
      const parsedUrl = new URL(url.replace("whatsapp://send", "http://placeholder"));
      const phone = parsedUrl.searchParams.get("phone") || "";
      const text = parsedUrl.searchParams.get("text") || undefined;
      return {
        phone: sanitizePhone(phone).fullNumber,
        text: text ? decodeURIComponent(text) : undefined,
        scheme: "whatsapp://send",
      };
    }

    const parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    const hostname = parsedUrl.hostname.toLowerCase();

    if (hostname.includes("wa.me")) {
      const phonePath = parsedUrl.pathname.replace(/^\/+/, "");
      const text = parsedUrl.searchParams.get("text") || undefined;
      return {
        phone: sanitizePhone(phonePath).fullNumber,
        text: text ? decodeURIComponent(text) : undefined,
        scheme: "wa.me",
      };
    }

    if (hostname.includes("api.whatsapp.com")) {
      const phone = parsedUrl.searchParams.get("phone") || "";
      const text = parsedUrl.searchParams.get("text") || undefined;
      return {
        phone: sanitizePhone(phone).fullNumber,
        text: text ? decodeURIComponent(text) : undefined,
        scheme: "api.whatsapp.com",
      };
    }

    return {
      phone: "",
      scheme: "unknown",
    };
  } catch {
    return {
      phone: "",
      scheme: "unknown",
    };
  }
}
