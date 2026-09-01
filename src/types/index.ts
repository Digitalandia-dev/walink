export type WaLinkScheme = "wa.me" | "api.whatsapp.com" | "whatsapp://send";

export interface WaLinkConfig {
  /**
   * Esquema de URL a utilizar:
   * - 'wa.me' (por defecto): https://wa.me/<numero>?text=<mensaje_codificado>
   * - 'api.whatsapp.com': https://api.whatsapp.com/send?phone=<numero>&text=<mensaje_codificado>
   * - 'whatsapp://send': whatsapp://send?phone=<numero>&text=<mensaje_codificado>
   */
  scheme?: WaLinkScheme;

  /**
   * Numero de telefono con o sin formato (+, espacios, guiones, parentesis, etc.)
   * Ejemplo: "+52 (55) 1234-5678" -> "525512345678"
   */
  phone: string;

  /**
   * Mensaje predeterminado opcional para el chat de WhatsApp.
   */
  text?: string;

  /**
   * Codigo de pais por defecto (ej: '52' o '+52') si el numero no lo incluye.
   */
  defaultCountryCode?: string;

  /**
   * Bandera de validacion estricta segun el estandar internacional E.164.
   */
  strict?: boolean;
}

export type WaLinkOptions = WaLinkConfig;

export interface SanitizePhoneOptions {
  /**
   * Prefijo o codigo de pais por defecto si el numero no lo incluye.
   */
  defaultCountryCode?: string;

  /**
   * Arroja un error si el numero sanitizado no cumple la longitud de 7 a 15 digitos.
   */
  strict?: boolean;
}

export interface PhoneSanitized {
  /**
   * Codigo de pais identificado o aplicado.
   */
  countryCode: string;

  /**
   * Numero de telefono local sin el codigo de pais.
   */
  number: string;

  /**
   * Numero de telefono completo sanitizado (puros digitos).
   */
  fullNumber: string;

  /**
   * Valida si el numero cumple con la longitud del estandar internacional E.164 (7 a 15 digitos).
   */
  isValid: boolean;
}

export interface ParseWaLinkResult {
  /**
   * Numero de telefono extraido del enlace.
   */
  phone: string;

  /**
   * Mensaje decodificado extraido del enlace, si existia.
   */
  text?: string;

  /**
   * Esquema identificado en el enlace ('wa.me', 'api.whatsapp.com', 'whatsapp://send' o 'unknown').
   */
  scheme: WaLinkScheme | "unknown";
}

export type QRCodeErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface WaQROptions {
  /**
   * Ancho y alto del codigo QR en pixeles (para DataURL/PNG) o vista viewBox (para SVG).
   * Por defecto: 300.
   */
  width?: number;

  /**
   * Margen de seguridad (Quiet Zone) en modulos.
   * Por defecto: 2.
   */
  margin?: number;

  /**
   * Nivel de correccion de errores:
   * - 'L' (Low ~7%)
   * - 'M' (Medium ~15%)
   * - 'Q' (Quartile ~25%)
   * - 'H' (High ~30% - Recomendado para incrustar logotipos en el centro).
   * Por defecto: 'H'.
   */
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;

  /**
   * Colores personalizados para el codigo QR.
   */
  color?: {
    /**
     * Color de los modulos del QR (hexadecimal o CSS color, ej: '#000000' o '#25D366').
     * Por defecto: '#000000'.
     */
    dark?: string;

    /**
     * Color de fondo del QR (hexadecimal o CSS color, ej: '#FFFFFF' o '#00000000' para transparente).
     * Por defecto: '#FFFFFF'.
     */
    light?: string;
  };
}

export interface WaQRResult {
  /**
   * Cadena SVG vectorial pura lista para incrustar en HTML o enviar a imprenta.
   */
  svg: string;

  /**
   * Imagen codificada en Base64 Data URL (image/png) lista para usar en etiquetas <img> o descarga inmediata.
   */
  dataUrl: string;

  /**
   * Enlace de WhatsApp codificado a partir del cual se genero el codigo QR.
   */
  link: string;
}

export type WaLinkResult = WaQRResult;

export interface CountryInfo {
  /**
   * Codigo ISO 3166-1 alfa-2 del pais (ej: 'MX', 'CO', 'ES').
   */
  iso: string;

  /**
   * Nombre en espanol del pais.
   */
  name: string;

  /**
   * Prefijo o codigo telefonico internacional sin el '+' (ej: '52', '57', '34').
   */
  dialCode: string;
}
