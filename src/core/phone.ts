import { COUNTRIES } from "../data/countries";
import type { PhoneSanitized, SanitizePhoneOptions } from "../types";

/**
 * Limpia un numero de telefono y valida el formato internacional E.164.
 *
 * @param phone - Numero telefonico con o sin formato.
 * @param options - Opciones de prefijo por defecto y validacion estricta.
 * @returns Objeto desglosado con codigo de pais, numero local, numero completo y validez.
 */
export function sanitizePhone(phone: string, options?: SanitizePhoneOptions): PhoneSanitized {
  const raw = phone ?? "";

  // Quitar todo lo que no sea digito numerico (espacios, +, -, (), etc.)
  let cleaned = raw.replace(/\D/g, "");

  // Limpiar tambien el codigo de pais por defecto si viene con '+'
  const defaultCountry = options?.defaultCountryCode
    ? options.defaultCountryCode.replace(/\D/g, "")
    : undefined;

  // Si el usuario no puso el '+' original y diste un pais por defecto, agregarlo
  if (defaultCountry && cleaned.length > 0 && !raw.trim().startsWith("+")) {
    if (!cleaned.startsWith(defaultCountry)) {
      cleaned = `${defaultCountry}${cleaned}`;
    }
  }

  // Detectar o inferir el codigo de pais
  let countryCode = defaultCountry || "";
  let localNumber = cleaned;

  if (!countryCode && raw.trim().startsWith("+")) {
    const matchedCountry = COUNTRIES.slice()
      .sort((a, b) => b.dialCode.length - a.dialCode.length)
      .find((c) => cleaned.startsWith(c.dialCode));

    if (matchedCountry) {
      countryCode = matchedCountry.dialCode;
    }
  }

  if (countryCode && cleaned.startsWith(countryCode)) {
    localNumber = cleaned.slice(countryCode.length);
  }

  // Validar norma E.164 (entre 7 y 15 digitos en total)
  const isValid = cleaned.length >= 7 && cleaned.length <= 15;

  // Si activaron el modo estricto y no es valido, lanzar error
  if (options?.strict && !isValid) {
    throw new Error(
      `Numero de telefono no valido: "${raw}". Se esperaban entre 7 y 15 digitos segun el estandar E.164.`,
    );
  }

  return {
    countryCode,
    number: localNumber,
    fullNumber: cleaned,
    isValid,
  };
}
