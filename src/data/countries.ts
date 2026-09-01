import type { CountryInfo } from "../types";

/**
 * Catalogo ordenado de paises hispanohablantes e internacionales clave.
 */
export const COUNTRIES: CountryInfo[] = [
  { iso: "MX", name: "Mexico", dialCode: "52" },
  { iso: "CO", name: "Colombia", dialCode: "57" },
  { iso: "ES", name: "Espana", dialCode: "34" },
  { iso: "AR", name: "Argentina", dialCode: "54" },
  { iso: "PE", name: "Peru", dialCode: "51" },
  { iso: "CL", name: "Chile", dialCode: "56" },
  { iso: "EC", name: "Ecuador", dialCode: "593" },
  { iso: "GT", name: "Guatemala", dialCode: "502" },
  { iso: "VE", name: "Venezuela", dialCode: "58" },
  { iso: "DO", name: "Republica Dominicana", dialCode: "1809" },
  { iso: "BO", name: "Bolivia", dialCode: "591" },
  { iso: "HN", name: "Honduras", dialCode: "504" },
  { iso: "PY", name: "Paraguay", dialCode: "595" },
  { iso: "SV", name: "El Salvador", dialCode: "503" },
  { iso: "NI", name: "Nicaragua", dialCode: "505" },
  { iso: "CR", name: "Costa Rica", dialCode: "506" },
  { iso: "PA", name: "Panama", dialCode: "507" },
  { iso: "UY", name: "Uruguay", dialCode: "598" },
  { iso: "PR", name: "Puerto Rico", dialCode: "1787" },
  { iso: "US", name: "Estados Unidos / Canada", dialCode: "1" },
  { iso: "BR", name: "Brasil", dialCode: "55" },
];

/**
 * Busca un pais por su codigo ISO o por su prefijo telefonico.
 *
 * @param query - Codigo ISO ('MX') o prefijo telefonico ('52' o '+52').
 * @returns La informacion del pais encontrado o undefined.
 */
export function findCountry(query: string): CountryInfo | undefined {
  if (!query) return undefined;
  const clean = query.replace(/\D/g, "");
  const upper = query.trim().toUpperCase();

  return COUNTRIES.find((c) => c.iso === upper || (clean.length > 0 && c.dialCode === clean));
}
