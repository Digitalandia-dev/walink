import { describe, expect, it } from "bun:test";
import { createWaLink, sanitizePhone, VERSION } from "../src/index";

describe("Librería walink", () => {
  it("debe tener definida la versión correcta", () => {
    expect(VERSION).toBe("1.0.0");
  });

  describe("sanitizePhone", () => {
    it("debe limpiar espacios, guiones, paréntesis y signos +", () => {
      const result = sanitizePhone("+52 (55) 1234-5678");
      expect(result.fullNumber).toBe("525512345678");
      expect(result.isValid).toBe(true);
    });

    it("debe aplicar el código de país por defecto si falta", () => {
      const result = sanitizePhone("5512345678", { defaultCountryCode: "52" });
      expect(result.fullNumber).toBe("525512345678");
    });

    it("debe lanzar un error en modo estricto si el número es inválido", () => {
      expect(() => sanitizePhone("123", { strict: true })).toThrow();
    });
  });

  describe("createWaLink", () => {
    it("debe generar un link wa.me estándar sin mensaje", () => {
      const link = createWaLink({ phone: "+52 55 1234 5678" });
      expect(link).toBe("https://wa.me/525512345678");
    });

    it("debe codificar el mensaje con acentos y emojis", () => {
      const link = createWaLink({
        phone: "+52 55 1234 5678",
        text: "¡Hola! Quiero agendar una cita 📅 y pedir info 🚀",
        scheme: "wa.me",
      });
      expect(link).toBe(
        "https://wa.me/525512345678?text=%C2%A1Hola!%20Quiero%20agendar%20una%20cita%20%F0%9F%93%85%20y%20pedir%20info%20%F0%9F%9A%80",
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
});
