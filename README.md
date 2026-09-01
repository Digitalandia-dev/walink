# @digitalandia/walink

TypeScript toolkit ligero, isomórfico y de alto rendimiento para **normalizar números telefónicos, generar enlaces directos y crear códigos QR vectoriales compatibles con WhatsApp**.

<p align="left">
  <a href="https://www.npmjs.com/package/@digitalandia/walink"><img src="https://img.shields.io/npm/v/@digitalandia/walink.svg?style=flat-square&color=6366f1" alt="npm version" /></a>
  <a href="https://bundlephobia.com/package/@digitalandia/walink"><img src="https://img.shields.io/bundlephobia/minzip/@digitalandia/walink?style=flat-square&color=00CC66" alt="bundle size" /></a>
  <img src="https://img.shields.io/badge/Versi%C3%B3n-2.0.1-6366f1?style=flat-square" alt="Version 2.0.1" />
  <img src="https://img.shields.io/badge/Bundler-tsup-863bff?style=flat-square&logo=esbuild&logoColor=white" alt="tsup" />
  <img src="https://img.shields.io/badge/Linter_%26_Format-Biome_v2-60a5fa?style=flat-square&logo=biome&logoColor=white" alt="Biome v2" />
  <img src="https://img.shields.io/badge/Test_Runner-Bun_Test-000000?style=flat-square&logo=bun&logoColor=white" alt="Bun Test" />
  <img src="https://img.shields.io/badge/Output-ESM_+_CJS_+_DTS-00CC66?style=flat-square" alt="Dual Output ESM/CJS" />
  <img src="https://img.shields.io/badge/Licencia-MIT-222228?style=flat-square" alt="Licencia MIT" />
</p>

---

## ¿Qué problema resuelve?

Generar enlaces de WhatsApp parece trivial, pero en producción suele fallar por números con formatos irregulares (espacios, guiones, signos `+`, paréntesis o prefijos móviles desactualizados como el `+52 1` de México), mensajes mal codificados o códigos QR de baja resolución que se pixelan al imprimirse.

`@digitalandia/walink` abstrae toda esta complejidad en un SDK compacto, sin dependencias pesadas y 100% isomórfico.

---

## Características Principales

- **Constructor Universal de Enlaces (`createWaLink`)**: Soporte para esquemas `wa.me`, `api.whatsapp.com` y esquema de app nativa `whatsapp://send` con codificación segura de caracteres especiales, emojis y saltos de línea.
- **Normalización de Teléfonos (`sanitizePhone` & `formatPhone`)**: Limpieza de caracteres no numéricos y normalización a identificadores estándar E.164 compatibles con WhatsApp.
- **Validador Rápido (`isValidPhone`)**: Validación booleana instantánea para formularios y validaciones de entrada en el cliente.
- **Parser Inverso (`parseWaLink`)**: Descompone cualquier URL existente de WhatsApp extrayendo el teléfono limpio, el mensaje decodificado y el esquema.
- **Motor de Códigos QR (`generateWaQR`)**: Renderizado en **SVG vectorial** (escalabilidad infinita para lonas, volantes y menús de restaurantes) y **Data URL PNG** (para vista previa y descarga web).
- **Corrección de Error 'H' (30%)**: Permite incrustar logotipos en el centro del código QR sin comprometer la capacidad de escaneo.
- **Catálogo de Países (`COUNTRIES` & `findCountry`)**: Lista de países hispanohablantes e internacionales con prefijos telefónicos y códigos ISO.
- **Dual ESM / CJS & Tipado Estricto**: Compatible con React, Next.js, Vue, Svelte, Angular, Node.js, Bun, Deno y Edge Workers (Cloudflare, Vercel).

---

## Instalación

```bash
# Con NPM
npm install @digitalandia/walink

# Con Bun
bun add @digitalandia/walink

# Con PNPM
pnpm add @digitalandia/walink

# Con Yarn
yarn add @digitalandia/walink
```

---

## Guía de Uso

### 1. Crear un enlace directo de WhatsApp

```typescript
import { createWaLink } from "@digitalandia/walink";

// Enlace simple a partir de un número con formato
const link = createWaLink({
  phone: "+52 (55) 1234-5678",
});
// Salida: "https://wa.me/525512345678"

// Enlace con mensaje predeterminado y prefijo por defecto
const customLink = createWaLink({
  phone: "5512345678",
  defaultCountryCode: "52",
  text: "¡Hola! Quisiera agendar una cita y pedir información",
  scheme: "wa.me", // Opcional: 'wa.me' | 'api.whatsapp.com' | 'whatsapp://send'
});
// Salida: "https://wa.me/525512345678?text=%C2%A1Hola!%20Quisiera%20agendar%20una%20cita%20y%20pedir%20informaci%C3%B3n"
```

---

### 2. Generar Códigos QR (SVG Vectorial y Data URL PNG)

```typescript
import { generateWaQR, generateWaQRSvg, generateWaQRDataUrl } from "@digitalandia/walink";

// Generar tanto SVG como PNG Data URL en una sola llamada
const qr = await generateWaQR(
  {
    phone: "+52 55 1234 5678",
    text: "Hola, me interesa el servicio",
  },
  {
    width: 400,
    margin: 2,
    errorCorrectionLevel: "H", // Nivel alto (30%) para colocar logos centrales
    color: {
      dark: "#25D366", // Color del código
      light: "#FFFFFF", // Color de fondo
    },
  }
);

console.log(qr.link);    // URL final de WhatsApp
console.log(qr.svg);     // <svg ...> (Listo para imprenta o insertar en DOM)
console.log(qr.dataUrl); // data:image/png;base64,... (Listo para <img src="...">)
```

---

### 3. Ejemplo de Integración en React / Next.js

```tsx
import { useState } from "react";
import { createWaLink, generateWaQRDataUrl, isValidPhone } from "@digitalandia/walink";

export function WhatsAppWidget() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!isValidPhone(phone)) return alert("Número telefónico no válido");

    const link = createWaLink({ phone, text: message });
    const qr = await generateWaQRDataUrl(link, { width: 280 });
    setQrCode(qr);
  };

  return (
    <div className="p-4 border rounded-xl max-w-sm">
      <input
        type="tel"
        placeholder="Teléfono (ej: +52 55 1234 5678)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <textarea
        placeholder="Mensaje inicial..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button onClick={handleGenerate} className="w-full bg-emerald-600 text-white p-2 rounded">
        Generar Enlace & QR
      </button>

      {qrCode && (
        <div className="mt-4 text-center">
          <img src={qrCode} alt="WhatsApp QR" className="mx-auto rounded" />
        </div>
      )}
    </div>
  );
}
```

---

### 4. Normalización y Validación de Teléfonos

```typescript
import { sanitizePhone, formatPhone, isValidPhone, formatPhoneDisplay } from "@digitalandia/walink";

// Validación booleana rápida
if (isValidPhone("+52 55 1234 5678")) {
  console.log("Estructura válida para WhatsApp");
}

// Normalización al formato E.164 (corrige automáticamente casos como +52 1 en México)
const normalized = formatPhone("+52 1 (55) 1234-5678");
// "525512345678"

// Desglose estructurado
const info = sanitizePhone("+52 (55) 1234-5678");
// {
//   countryCode: "52",
//   number: "5512345678",
//   fullNumber: "525512345678",
//   isValid: true
// }

// Formateo visual para el usuario
const display = formatPhoneDisplay("525512345678");
// "+525512345678"
```

---

### 5. Parser Inverso de Enlaces

```typescript
import { parseWaLink } from "@digitalandia/walink";

const parsed = parseWaLink("https://wa.me/525512345678?text=Hola%20Mundo");

console.log(parsed.phone);  // "525512345678"
console.log(parsed.text);   // "Hola Mundo"
console.log(parsed.scheme); // "wa.me"
```

---

### 6. Catálogo de Países y Prefijos

```typescript
import { COUNTRIES, findCountry } from "@digitalandia/walink";

// Buscar por prefijo o código ISO
const mexico = findCountry("52");
// { iso: "MX", name: "Mexico", dialCode: "52" }

const colombia = findCountry("CO");
// { iso: "CO", name: "Colombia", dialCode: "57" }
```

---

## API Reference

| Función / Constante | Descripción |
| :--- | :--- |
| `createWaLink(options)` | Genera la URL codificada de WhatsApp según el esquema elegido. |
| `generateWaQR(linkOrOptions, qrOptions?)` | Retorna `{ svg, dataUrl, link }` con el código QR renderizado. |
| `generateWaQRSvg(linkOrOptions, qrOptions?)` | Genera directamente la cadena SVG vectorial pura. |
| `generateWaQRDataUrl(linkOrOptions, qrOptions?)` | Genera la cadena Data URL en PNG Base64. |
| `sanitizePhone(phone, options?)` | Desglosa el teléfono en `{ countryCode, number, fullNumber, isValid }`. |
| `formatPhone(phone, defaultCountryCode?)` | Normaliza el número al formato estándar internacional E.164. |
| `isValidPhone(phone, defaultCountryCode?)` | Retorna un booleano indicando si el número cumple la estructura E.164. |
| `formatPhoneDisplay(phone)` | Añade el prefijo `+` para formateo visual legible. |
| `parseWaLink(url)` | Extrae número, mensaje decodificado y esquema desde cualquier link existente. |
| `findCountry(query)` | Busca un país por prefijo telefónico o código ISO 3166-1. |
| `COUNTRIES` | Catálogo de países con código ISO, nombre y dialCode. |
| `VERSION` | Cadena con la versión semántica actual de la librería. |

---

## Comandos de Desarrollo

```bash
# Iniciar modo desarrollo
bun run dev

# Ejecutar validación completa (typecheck + tests + lint)
bun run check

# Compilar para producción (genera dist/)
bun run build
```

---

## Enlaces del Ecosistema

- **Registro npm**: [@digitalandia/walink en npmjs.com](https://www.npmjs.com/package/@digitalandia/walink)
- **Código Fuente**: [Digitalandia-dev/walink en GitHub](https://github.com/Digitalandia-dev/walink)
- **Reporte de Problemas**: [GitHub Issues](https://github.com/Digitalandia-dev/walink/issues)

---

## Licencia

Distribuido bajo la Licencia **MIT**. Desarrollado para **[Digitalandia](https://digitalandia.com)**.
