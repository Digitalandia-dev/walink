import { describe, expect, it } from "bun:test";
import {
  COUNTRIES,
  createWaLink,
  findCountry,
  formatPhone,
  formatPhoneDisplay,
  generateWaQR,
  generateWaQRDataUrl,
  generateWaQRSvg,
  isValidPhone,
  parseWaLink,
  sanitizePhone,
  VERSION,
} from "../src/index";

describe("Libreria walink v2.0.1", () => {
  it("debe tener definida la version 2.0.1", () => {
    expect(VERSION).toBe("2.0.1");
  });

  describe("sanitizePhone y formatPhone", () => {
    it("debe limpiar espacios, guiones, parentesis y signos +", () => {
      const result = sanitizePhone("+52 (55) 1234-5678");
      expect(result.fullNumber).toBe("525512345678");
      expect(result.number).toBe("5512345678");
      expect(result.isValid).toBe(true);
    });

    it("debe aplicar el codigo de pais por defecto si falta", () => {
      const result = sanitizePhone("5512345678", { defaultCountryCode: "52" });
      expect(result.fullNumber).toBe("525512345678");
      expect(result.countryCode).toBe("52");
    });

    it("debe corregir caso especial del prefijo movil de Mexico +52 1", () => {
      const formatted = formatPhone("+52 1 55 1234 5678");
      expect(formatted).toBe("525512345678");
    });

    it("debe lanzar un error en modo estricto si el numero es invalido", () => {
      expect(() => sanitizePhone("123", { strict: true })).toThrow();
    });
  });

  describe("isValidPhone", () => {
    it("debe retornar true ante numeros validos y false ante invalidos", () => {
      expect(isValidPhone("+52 55 1234 5678")).toBe(true);
      expect(isValidPhone("5512345678", "52")).toBe(true);
      expect(isValidPhone("123")).toBe(false);
      expect(isValidPhone("")).toBe(false);
    });
  });

  describe("formatPhoneDisplay", () => {
    it("debe retornar numero con prefijo +", () => {
      expect(formatPhoneDisplay("525512345678")).toBe("+525512345678");
      expect(formatPhoneDisplay("")).toBe("");
    });
  });

  describe("createWaLink", () => {
    it("debe generar un link wa.me estandar sin mensaje", () => {
      const link = createWaLink({ phone: "+52 55 1234 5678" });
      expect(link).toBe("https://wa.me/525512345678");
    });

    it("debe codificar el mensaje con acentos", () => {
      const link = createWaLink({
        phone: "+52 55 1234 5678",
        text: "Hola quiero agendar una cita y pedir informacion",
        scheme: "wa.me",
      });
      expect(link).toBe(
        "https://wa.me/525512345678?text=Hola%20quiero%20agendar%20una%20cita%20y%20pedir%20informacion",
      );
    });

    it("debe generar link con esquema api.whatsapp.com", () => {
      const link = createWaLink({
        phone: "+52 55 1234 5678",
        text: "Hola",
        scheme: "api.whatsapp.com",
      });
      expect(link).toBe("https://api.whatsapp.com/send?phone=525512345678&text=Hola");
    });

    it("debe generar link con esquema de app nativa whatsapp://send", () => {
      const link = createWaLink({
        phone: "+52 55 1234 5678",
        text: "Hola",
        scheme: "whatsapp://send",
      });
      expect(link).toBe("whatsapp://send?phone=525512345678&text=Hola");
    });
  });

  describe("parseWaLink", () => {
    it("debe parsear enlaces wa.me con mensaje codificado", () => {
      const parsed = parseWaLink("https://wa.me/525512345678?text=Hola%20Prueba");
      expect(parsed.phone).toBe("525512345678");
      expect(parsed.text).toBe("Hola Prueba");
      expect(parsed.scheme).toBe("wa.me");
    });

    it("debe parsear enlaces api.whatsapp.com", () => {
      const parsed = parseWaLink("https://api.whatsapp.com/send?phone=525512345678&text=Hola");
      expect(parsed.phone).toBe("525512345678");
      expect(parsed.text).toBe("Hola");
      expect(parsed.scheme).toBe("api.whatsapp.com");
    });

    it("debe parsear esquemas nativos whatsapp://send", () => {
      const parsed = parseWaLink("whatsapp://send?phone=525512345678&text=Mensaje%20App");
      expect(parsed.phone).toBe("525512345678");
      expect(parsed.text).toBe("Mensaje App");
      expect(parsed.scheme).toBe("whatsapp://send");
    });

    it("debe retornar unknown ante URLs no validas", () => {
      const parsed = parseWaLink("https://google.com");
      expect(parsed.scheme).toBe("unknown");
      expect(parsed.phone).toBe("");
    });
  });

  describe("countries catalog", () => {
    it("debe contener lista de paises", () => {
      expect(COUNTRIES.length).toBeGreaterThan(15);
    });

    it("debe encontrar pais por prefijo o codigo ISO", () => {
      const mx = findCountry("52");
      expect(mx?.name).toBe("Mexico");
      expect(mx?.iso).toBe("MX");

      const co = findCountry("CO");
      expect(co?.dialCode).toBe("57");
    });
  });

  describe("QR Generation", () => {
    it("debe generar SVG valido", async () => {
      const svg = await generateWaQRSvg({
        phone: "+52 55 1234 5678",
        text: "Hola",
      });
      expect(svg).toContain("<svg");
      expect(svg).toContain("</svg>");
    });

    it("debe generar Data URL PNG valido", async () => {
      const dataUrl = await generateWaQRDataUrl({
        phone: "+52 55 1234 5678",
        text: "Hola",
      });
      expect(dataUrl.startsWith("data:image/png;base64,")).toBe(true);
    });

    it("debe generar resultado compuesto con generateWaQR", async () => {
      const result = await generateWaQR(
        {
          phone: "+52 55 1234 5678",
          text: "Hola",
        },
        {
          color: { dark: "#25D366", light: "#FFFFFF" },
        },
      );

      expect(result.link).toBe("https://wa.me/525512345678?text=Hola");
      expect(result.svg).toContain("<svg");
      expect(result.dataUrl.startsWith("data:image/png;base64,")).toBe(true);
    });
  });
});
