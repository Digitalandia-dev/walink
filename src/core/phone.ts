import type { PhoneSanitized } from "../types";

export interface SanitizePhoneOptions {
  defaultCountryCode?: string;
  strict?: boolean;
}

/**
 * Limpia un número de teléfono y valida el formato internacional E.164.
 */
export function sanitizePhone(phone: string, options?: SanitizePhoneOptions): PhoneSanitized {
  const raw = phone ?? "";

  // 1. Quitar todo lo que no sea dígito numérico (espacios, +, -, (), etc.)
  let cleaned = raw.replace(/\D/g, "");

  // 2. Limpiar también el código de país por defecto si viene con '+'
  const defaultCountry = options?.defaultCountryCode
    ? options.defaultCountryCode.replace(/\D/g, "")
    : undefined;

  // 3. Si el usuario no puso el '+' original y diste un país por defecto, agregarlo
  if (defaultCountry && cleaned.length > 0 && !raw.trim().startsWith("+")) {
    if (!cleaned.startsWith(defaultCountry)) {
      cleaned = `${defaultCountry}${cleaned}`;
    }
  }

  // 4. Validar norma E.164 (entre 7 y 15 dígitos en total)
  const isValid = cleaned.length >= 7 && cleaned.length <= 15;

  // 5. Si activaron el modo estricto y no es válido, lanzar error
  if (options?.strict && !isValid) {
    throw new Error(
      `Número de teléfono no válido: "${raw}". Se esperaban entre 7 y 15 dígitos según el estándar E.164.`,
    );
  }

  // 6. Separar código de país del número local
  const finalCountryCode = defaultCountry || "";
  const localNumber =
    finalCountryCode && cleaned.startsWith(finalCountryCode)
      ? cleaned.slice(finalCountryCode.length)
      : cleaned;

  return {
    countryCode: finalCountryCode,
    number: localNumber,
    fullNumber: cleaned,
    isValid,
  };
}
