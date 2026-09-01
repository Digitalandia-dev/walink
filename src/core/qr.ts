import QRCode from "qrcode";
import type { WaLinkConfig, WaQROptions, WaQRResult } from "../types";
import { createWaLink } from "./link";

/**
 * Opciones por defecto para la generacion de codigos QR.
 */
const DEFAULT_QR_OPTIONS: Required<Omit<WaQROptions, "color">> & {
  color: Required<NonNullable<WaQROptions["color"]>>;
} = {
  width: 300,
  margin: 2,
  errorCorrectionLevel: "H",
  color: {
    dark: "#000000",
    light: "#FFFFFF",
  },
};

/**
 * Genera el codigo QR de WhatsApp en formato SVG vectorial puro.
 *
 * @param linkOrOptions - Enlace directo o configuracion de WhatsApp.
 * @param options - Opciones de personalizacion del QR (colores, tamano, margen).
 * @returns Cadena con el contenido SVG completo.
 */
export async function generateWaQRSvg(
  linkOrOptions: string | WaLinkConfig,
  options?: WaQROptions,
): Promise<string> {
  const link = typeof linkOrOptions === "string" ? linkOrOptions : createWaLink(linkOrOptions);

  const mergedOptions = {
    width: options?.width ?? DEFAULT_QR_OPTIONS.width,
    margin: options?.margin ?? DEFAULT_QR_OPTIONS.margin,
    errorCorrectionLevel: options?.errorCorrectionLevel ?? DEFAULT_QR_OPTIONS.errorCorrectionLevel,
    color: {
      dark: options?.color?.dark ?? DEFAULT_QR_OPTIONS.color.dark,
      light: options?.color?.light ?? DEFAULT_QR_OPTIONS.color.light,
    },
  };

  return QRCode.toString(link, {
    type: "svg",
    width: mergedOptions.width,
    margin: mergedOptions.margin,
    errorCorrectionLevel: mergedOptions.errorCorrectionLevel,
    color: mergedOptions.color,
  });
}

/**
 * Genera el codigo QR de WhatsApp en formato Base64 Data URL (image/png).
 *
 * @param linkOrOptions - Enlace directo o configuracion de WhatsApp.
 * @param options - Opciones de personalizacion del QR (colores, tamano, margen).
 * @returns Cadena en formato data:image/png;base64,...
 */
export async function generateWaQRDataUrl(
  linkOrOptions: string | WaLinkConfig,
  options?: WaQROptions,
): Promise<string> {
  const link = typeof linkOrOptions === "string" ? linkOrOptions : createWaLink(linkOrOptions);

  const mergedOptions = {
    width: options?.width ?? DEFAULT_QR_OPTIONS.width,
    margin: options?.margin ?? DEFAULT_QR_OPTIONS.margin,
    errorCorrectionLevel: options?.errorCorrectionLevel ?? DEFAULT_QR_OPTIONS.errorCorrectionLevel,
    color: {
      dark: options?.color?.dark ?? DEFAULT_QR_OPTIONS.color.dark,
      light: options?.color?.light ?? DEFAULT_QR_OPTIONS.color.light,
    },
  };

  return QRCode.toDataURL(link, {
    width: mergedOptions.width,
    margin: mergedOptions.margin,
    errorCorrectionLevel: mergedOptions.errorCorrectionLevel,
    color: mergedOptions.color,
  });
}

/**
 * Genera un codigo QR completo para WhatsApp, retornando la version vectorial SVG
 * y la version Data URL en PNG.
 *
 * @param linkOrOptions - Enlace directo de WhatsApp o configuracion WaLinkConfig.
 * @param qrOptions - Opciones de personalizacion del QR.
 * @returns Objeto WaQRResult con svg, dataUrl y link.
 */
export async function generateWaQR(
  linkOrOptions: string | WaLinkConfig,
  qrOptions?: WaQROptions,
): Promise<WaQRResult> {
  const link = typeof linkOrOptions === "string" ? linkOrOptions : createWaLink(linkOrOptions);

  const [svg, dataUrl] = await Promise.all([
    generateWaQRSvg(link, qrOptions),
    generateWaQRDataUrl(link, qrOptions),
  ]);

  return {
    svg,
    dataUrl,
    link,
  };
}
