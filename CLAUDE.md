# TransportationManagement

Software de gestión de transporte y carga para empresas latinoamericanas. Este repo es el hub de planificación: specs, planes y documentación.

## Propósito

Dar a operadores logísticos (flotas, cargas, rutas) una herramienta asequible. Nuestros usuarios tienen redes lentas — cada decisión técnica se evalúa con **"¿cómo se ve en 3G?"**

## Repositorios

| Repo | Descripción |
|---|---|
| `transport-management-ui` (este) | Planificación: specs y planes |
| `transport-management-landing` | Landing en Angular 17 — vitrina del producto (TMAGE-1) |

## Flujo de trabajo

**Jira → spec en `/specs/` → plan de tareas → código → cerrar subtask en Jira**

No se escribe código sin spec aprobado.

## Decisiones técnicas (no cuestionar sin razón de peso)

- Angular 17 standalone + lazy loading en todas las rutas
- AWS S3 + CloudFront para deploy
- SCSS puro — sin Bootstrap, Tailwind ni Material completo
- Imágenes en WebP, fuentes del sistema (sin Google Fonts)
- Secretos solo en variables de entorno / GitHub Secrets — nunca en código

## Key Constraints (from AGENTS.md)

- Keep solutions simple — never over-engineer
- No defensive programming beyond what's needed
- No features outside MVP scope
- Traceability is critical: emit INFO/DEBUG/ERROR logs throughout
- For any issue, identify the root cause with evidence before fixing

## Estado del Proyecto

| Repo | Fase actual | Estado |
|---|---|---|
| `transport-management-landing` | Phase 4 + 6 | 🟡 Pendiente confirmación Formspree + AWS |

### TMAGE-1: Landing Site
- ✅ Phase 1: Scaffold Angular 17, diseño SCSS, routing con lazy loading (2026-05-30)
- ✅ Phase 2: 5 shared components (Navbar, Footer, Button, SectionHeader, FeatureCard) — 20/20 tests (2026-05-31)
- ✅ Phase 3: 4 páginas implementadas (Home, About, Product, Contact con Reactive Forms) (2026-05-31)
- ⏳ Phase 4: Integración Formspree (ContactService stub existe; falta ID de formulario + estados loading/success/error)
- ✅ Phase 5: Bundle budgets (initial 400KB/500KB), optimize-images (sharp), análisis de bundle (2026-05-31)
- ⏳ Phase 6: CI/CD GitHub Actions + AWS S3/CloudFront — pendiente (lo hará el usuario)
- ✅ Phase 7: Tests — 28/28 unit tests, 7/7 E2E Playwright pasan (2026-05-31)

### Notas técnicas activas
- **Node.js**: Usar `nvm use 20` en `transport-management-landing` (v16 no soportada por Angular CLI 17)
- **SCSS budgets**: Navbar (3.85KB) y Footer (2.98KB) superan el warning de 2KB — no son errores de build; se optimizan en Phase 5 (Task 15)
- **Animación hamburguesa**: El icono hamburguesa no anima a ×; se agrega en Phase 5 (reducida para pasar budget de 4KB)

## Tracking

Jira: [mccsss.atlassian.net — TMAGE](https://mccsss.atlassian.net/browse/TMAGE)
