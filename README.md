# Template TypeScript Library

Base de desarrollo ultraligera, minimalista y de alto rendimiento para crear, verificar y empaquetar librerías TypeScript modernas en **[Digitalandia](https://digitalandia.com)**.

<p align="left">
  <img src="https://img.shields.io/badge/Bundler-tsup-863bff?style=flat-square&logo=esbuild&logoColor=white" alt="tsup" />
  <img src="https://img.shields.io/badge/Linter_%26_Format-Biome_v2-60a5fa?style=flat-square&logo=biome&logoColor=white" alt="Biome v2" />
  <img src="https://img.shields.io/badge/Test_Runner-Bun_Test-000000?style=flat-square&logo=bun&logoColor=white" alt="Bun Test" />
  <img src="https://img.shields.io/badge/Output-ESM_+_CJS_+_DTS-00CC66?style=flat-square" alt="Dual Output ESM/CJS" />
  <img src="https://img.shields.io/badge/Licencia-MIT-222228?style=flat-square" alt="Licencia MIT" />
</p>

---

## Inicio Rápido

### 1. Inicializar desde la Plantilla

Para clonar y crear un nuevo proyecto a partir de este repositorio:

```bash
# Crear proyecto desde la plantilla
bun create Digitalandia-dev/ts-library-template mi-libreria

# Entrar al directorio
cd mi-libreria

# Instalar dependencias
bun install
```

### 2. Comandos de Desarrollo

```bash
# Iniciar modo desarrollo (watch mode en tiempo real)
bun run dev

# Validar tipos, tests y reglas de formato
bun run check

# Compilar para producción (genera dist/)
bun run build
```

---

## Cómo Consumir la Librería en otros Proyectos

Una vez publicada o instalada localmente, los consumidores pueden instalarla con cualquier gestor de paquetes:

```bash
# Con Bun
bun add @digitalandia/mi-libreria

# Con NPM
npm install @digitalandia/mi-libreria

# Con PNPM
pnpm add @digitalandia/mi-libreria
```

Y usarla en cualquier entorno (soporte nativo ESM y CommonJS):

```typescript
// Módulos ESM (Vite, Next.js, Cloudflare Workers, Astro)
import { greet } from "@digitalandia/mi-libreria";

console.log(greet({ name: "Digitalandia" }));
```

```javascript
// CommonJS (Node.js tradicional)
const { greet } = require("@digitalandia/mi-libreria");

console.log(greet({ name: "Digitalandia" }));
```

---

## Características Técnicas

- **Empaquetado Ultrarrápido (`tsup`)**: Compilación optimizada sobre `esbuild` con soporte Dual Output (ESM para Vite/Next.js/Cloudflare y CommonJS para Node.js tradicional).
- **Definiciones TypeScript (`.d.ts`)**: Generación automática de tipos y sourcemaps para integración nativa de autocompletado en cualquier editor.
- **Suite de Pruebas Nativa (`bun test`)**: Ejecución instantánea de pruebas unitarias sin sobrecarga ni dependencias externas pesadas.
- **Linter & Formatter Determinista (`@biomejs/biome`)**: Análisis estático y formateo estricto de código en milisegundos.
- **Comando Unificado de Calidad (`bun run check`)**: Valida en cadena la verificación de tipos (`tsc`), suite de pruebas y formateo antes de compilar o publicar.
- **TypeScript Estricto**: Configuración de `tsconfig.json` con `strict: true` y resolución de módulos moderna.

---

## Estructura del Proyecto

```text
├── src/
│   └── index.ts          # Punto de entrada principal y exports públicos
├── tests/
│   └── index.test.ts     # Pruebas unitarias con bun:test
├── dist/                 # Artefactos compilados (ESM, CJS, DTS)
├── biome.json            # Configuración de formateo y reglas de linter
├── package.json          # Manifiesto npm con mapeo dual de exports
├── tsconfig.json         # Configuración estricta de TypeScript
├── tsup.config.ts        # Configuración de build tsup
├── LICENSE               # Licencia de software MIT
└── README.md
```

---

## Comandos Disponibles

| Comando              | Descripción                                                           |
| :------------------- | :-------------------------------------------------------------------- |
| `bun run dev`        | Inicia la compilación en tiempo real ante cualquier cambio en `src/`. |
| `bun run build`      | Genera los artefactos finales de producción en el directorio `dist/`. |
| `bun run check`      | Ejecuta la validación completa (`typecheck` + `test` + `lint`).       |
| `bun run test`       | Ejecuta las pruebas unitarias con `bun test`.                         |
| `bun run test:watch` | Ejecuta las pruebas en modo interactivo/observador.                   |
| `bun run typecheck`  | Valida errores de tipos TypeScript sin emitir archivos.               |
| `bun run lint`       | Ejecuta el análisis estático de código con Biome.                     |
| `bun run format`     | Corrige y formatea automáticamente el código con Biome.               |

---

## Uso de la Plantilla para una Nueva Librería

1. **Definir el paquete:** Actualizar los campos `name`, `description` y `version` en `package.json`.
2. **Escribir la lógica:** Implementar las funciones y tipos en `src/index.ts`.
3. **Escribir los tests:** Añadir las especificaciones de prueba en `tests/`.
4. **Verificar y Compilar:** Ejecutar `bun run check` seguido de `bun run build`.

---

## Licencia

Este proyecto se distribuye bajo la Licencia **MIT**. Consulte el archivo [LICENSE](./LICENSE) para más detalles.
