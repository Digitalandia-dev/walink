export type WaLinkScheme = "wa.me" | "api.whatsapp.com" | "whatsapp://send";

export interface WaLinkConfig {
  /**
   * Esquema de URL a utilizar
   * - 'wa.me' (por defecto): https://wa.me/<numero>?text=<mensaje_codificado>
   * - 'api.whatsapp.com': https://api.whatsapp.com/send?phone=<numero>&text=<mensaje_codificado>
   * - 'whatsapp://send': whatsapp://send?phone=<numero>&text=<mensaje_codificado>
   */
  scheme?: WaLinkScheme;
  /**
   * Número de teléfono con o sin formato (+, espacios, guiones, paréntesis, etc.)
   * Ejemplo: "+52 (55) 1234-5678" -> "525512345678"
   */
  phone: string;
  /**
   * Mensaje predeterminado opcional para el chat de WhatsApp.
   */
  text?: string;
  /**
   * Código de país por defecto
   */
  defaultCountryCode?: string;
  /**
   * Bandera de validación de numero valido por formato E.164
   */
  strict?: boolean;
}

export interface PhoneSanitized {
  /**
   * Código de país
   */
  countryCode: string;
  /**
   * Número de teléfono
   */
  number: string;
  /**
   * Número de teléfono completo
   */
  fullNumber: string;
  /**
   * Valida si el número es válido
   */
  isValid: boolean;
}
