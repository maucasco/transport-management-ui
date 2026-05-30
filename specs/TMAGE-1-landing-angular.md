# Spec: Transport Management Landing Site — TMAGE-1

**Jira**: [TMAGE-1](https://mccsss.atlassian.net/browse/TMAGE-1)  
**Proyecto**: TransportationManagement  
**Estado**: Borrador — pendiente de aprobación humana  
**Fecha**: 2026-05-30

---

## Objective

Construir un sitio **landing page** en Angular que sirva como vitrina comercial del software de **Control de Transporte y Carga**, orientado a empresas pequeñas, medianas y grandes.

### Usuarios objetivo
- Gerentes logísticos y de operaciones de transporte
- Dueños de empresas de carga
- Administradores de flotas

### ¿Qué es el éxito?
- El sitio carga en menos de **3 segundos** en una conexión 3G lenta (< 1 Mbps)
- Es completamente usable en móvil, tablet y escritorio
- Un visitante puede entender el producto y contactar a la empresa sin fricción
- La página de Producto se puede actualizar con nuevos features sin romper el sitio

### Acceptance Criteria
- [ ] Hero section visible y cargando en < 1s (LCP)
- [ ] Formulario de contacto funcional (envía y confirma al usuario)
- [ ] Lighthouse score ≥ 85 en Performance en móvil
- [ ] Sin errores de consola en producción
- [ ] Sitio accesible desde URL pública en AWS S3 / CloudFront
- [ ] Responsive en 320px, 768px y 1280px de ancho

---

## Tech Stack

| Elemento | Tecnología |
|---|---|
| Framework | Angular **17** (standalone components) |
| Lenguaje | TypeScript 5.2 |
| Estilos | SCSS + CSS custom properties |
| Routing | Angular Router (lazy loading por página) |
| Formularios | Angular Reactive Forms |
| Formulario de contacto | Formspree (servicio externo gratuito) |
| Testing | Jasmine + Karma (unit), Playwright (e2e) |
| Build | Angular CLI 17 (`ng build`) |
| CI/CD | GitHub Actions |
| Despliegue | **AWS S3** (static website hosting) + **CloudFront** (CDN + HTTPS) |
| Infraestructura | AWS CLI v2 |
| Íconos | Material Symbols (subconjunto mínimo) |

---

## Commands

```bash
# Instalación
npm install

# Servidor de desarrollo
npm start                     # ng serve --open

# Build de producción
npm run build                 # ng build --configuration=production

# Tests unitarios
npm test                      # ng test

# Tests e2e
npm run e2e                   # playwright test

# Linting
npm run lint                  # ng lint

# Deploy a AWS S3
npm run deploy                # ng build --configuration=production && aws s3 sync dist/transport-management-landing/browser/ s3://$S3_BUCKET_NAME --delete
npm run invalidate            # aws cloudfront create-invalidation --distribution-id $CF_DISTRIBUTION_ID --paths "/*"
```

---

## Project Structure

```
transport-management-landing/
├── src/
│   ├── app/
│   │   ├── core/                      # Servicios singleton, guards
│   │   │   └── services/
│   │   │       └── contact.service.ts  # Integración con Formspree
│   │   ├── shared/                    # Componentes reutilizables
│   │   │   ├── navbar/
│   │   │   ├── footer/
│   │   │   └── button/
│   │   ├── pages/                     # Rutas principales (lazy loaded)
│   │   │   ├── home/                  # Hero + intro
│   │   │   ├── about/                 # Acerca de
│   │   │   ├── contact/               # Contáctenos
│   │   │   └── product/               # Producto (iterable)
│   │   ├── app.component.ts
│   │   ├── app.config.ts              # Standalone app config
│   │   └── app.routes.ts              # Rutas con lazy loading
│   ├── assets/
│   │   ├── images/                    # WebP optimizados
│   │   └── icons/
│   ├── styles/
│   │   ├── _variables.scss            # Design tokens
│   │   ├── _reset.scss
│   │   └── styles.scss
│   └── environments/
│       ├── environment.ts
│       └── environment.production.ts
├── e2e/                               # Tests Playwright
├── specs/                             # Documentos de especificación
│   └── TMAGE-1-landing-angular.md     # Este archivo
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Test + lint en PR
│       └── deploy.yml                 # Deploy en push a main
├── angular.json
├── package.json
└── README.md
```

---

## Routing Plan

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component')
  },
  {
    path: 'acerca-de',
    loadComponent: () => import('./pages/about/about.component')
  },
  {
    path: 'producto',
    loadComponent: () => import('./pages/product/product.component')
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact/contact.component')
  },
  {
    path: '**',
    redirectTo: ''
  }
];
```

---

## Component Breakdown

### Pages (lazy loaded)

| Página | Ruta | Descripción |
|---|---|---|
| `HomeComponent` | `/` | Hero, propuesta de valor, CTA principal |
| `AboutComponent` | `/acerca-de` | Historia, misión, equipo |
| `ProductComponent` | `/producto` | Features del producto (iterable) |
| `ContactComponent` | `/contacto` | Formulario + info de contacto |

### Shared Components

| Componente | Descripción |
|---|---|
| `NavbarComponent` | Navegación responsiva con menú hamburguesa en móvil |
| `FooterComponent` | Links, redes sociales, copyright |
| `ButtonComponent` | Botón reutilizable con variantes (primary/secondary/outline) |
| `SectionHeaderComponent` | Título + subtítulo de sección consistente |
| `FeatureCardComponent` | Tarjeta de feature (usada en ProductComponent) |

---

## Code Style

### Ejemplo de standalone component

```typescript
// pages/home/home.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly heroTitle = 'Control total de tu flota de transporte';
  readonly heroSubtitle = 'Solución integral para empresas de carga';
}
```

### Convenciones
- **Archivos**: `kebab-case` (ej. `feature-card.component.ts`)
- **Clases**: `PascalCase` (ej. `FeatureCardComponent`)
- **Variables/métodos**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE` (solo globales)
- **Selectores**: prefijo `app-` (ej. `app-navbar`)
- **SCSS**: BEM para clases CSS (`.hero__title`, `.hero--dark`)
- Sin `any` en TypeScript — usar tipos explícitos o `unknown`
- Signals de Angular para estado local cuando sea posible

---

## Performance Strategy (Redes Lentas)

| Técnica | Implementación |
|---|---|
| Lazy loading de rutas | `loadComponent()` en todas las rutas secundarias |
| Imágenes WebP | Convertir todos los assets a `.webp` + `loading="lazy"` |
| Critical CSS inline | Angular SSG o `defer` de estilos no críticos |
| Fuentes del sistema | Evitar Google Fonts — usar `font-family: system-ui` |
| Íconos SVG inline | Evitar librerías pesadas de íconos |
| Budget de bundle | Configurar `budgets` en `angular.json`: error > 500KB |
| Tree shaking | Solo importar lo necesario de Angular CDK/Material |
| Compresión | Gzip/Brotli habilitado en CloudFront + headers de caché en S3 |
| CDN | CloudFront sirve assets desde edge nodes cercanos al usuario |

---

## Testing Strategy

| Nivel | Framework | Ubicación | Cobertura mínima |
|---|---|---|---|
| Unit | Jasmine + Karma | `src/**/*.spec.ts` | 70% en servicios y lógica |
| Integración | Jasmine + TestBed | `src/**/*.spec.ts` | Componentes críticos |
| E2E | Playwright | `e2e/` | Flujo de contacto completo |

### Tests obligatorios antes de merge
- `ContactService` — envío de formulario (mock de Formspree)
- `NavbarComponent` — menú móvil se abre/cierra
- E2E: usuario llena y envía formulario de contacto

---

## GitHub Repository Setup

```bash
# 1. Crear repo en GitHub (público)
gh repo create transport-management-landing \
  --public \
  --description "Landing site para TransportationManagement — TMAGE-1" \
  --clone

# 2. Scaffolding con Angular 17 CLI
cd transport-management-landing
npx @angular/cli@17 new . \
  --routing \
  --style=scss \
  --standalone \
  --skip-git

# 3. Sin dependencias extra de deploy (se usa AWS CLI directamente)
# Agregar scripts en package.json:
# "deploy": "ng build --configuration=production && aws s3 sync dist/transport-management-landing/browser/ s3://$S3_BUCKET_NAME --delete"
# "invalidate": "aws cloudfront create-invalidation --distribution-id $CF_DISTRIBUTION_ID --paths '/*'"

# 4. Variables de entorno requeridas (en GitHub Actions Secrets, nunca en código):
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
# AWS_REGION (ej. us-east-1)
# S3_BUCKET_NAME
# CF_DISTRIBUTION_ID

# 5. Configurar S3 bucket para static website hosting
aws s3 website s3://$S3_BUCKET_NAME \
  --index-document index.html \
  --error-document index.html   # SPA: Angular Router maneja el 404

# 6. Primer commit
git add .
git commit -m "feat: initial Angular 17 scaffold for TMAGE-1 landing site"
git push -u origin main
```

### GitHub Actions — deploy.yml

```yaml
name: Deploy to AWS S3
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      - run: aws s3 sync dist/transport-management-landing/browser/ s3://${{ secrets.S3_BUCKET_NAME }} --delete
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CF_DISTRIBUTION_ID }} --paths "/*"
```

---

## Boundaries

**Always do:**
- Ejecutar `npm test` y `npm run lint` antes de cada commit
- Usar lazy loading en todas las rutas secundarias
- Optimizar imágenes a WebP antes de agregarlas
- Actualizar este spec cuando cambie el alcance

**Ask first:**
- Agregar dependencias npm nuevas (evaluar impacto en bundle)
- Cambiar estructura de rutas (afecta SEO y links existentes)
- Modificar el flujo del formulario de contacto
- Cambiar el proveedor de despliegue

**Never do:**
- Hacer commit de claves AWS, tokens de Formspree o cualquier credencial en el código (usar GitHub Secrets)
- Usar `any` en TypeScript sin justificación
- Agregar librerías CSS pesadas (Bootstrap, Material completo) sin aprobación
- Saltarse los tests e2e del formulario de contacto

---

## Open Questions

1. ~~**Despliegue**: ¿GitHub Pages o Vercel?~~ → **Resuelto**: AWS S3 + CloudFront
2. ~~**Angular version**~~ → **Resuelto**: Angular **17**
3. **Formulario de contacto**: ¿Tienes cuenta en Formspree o prefieres otro servicio (SES, SendGrid)?
4. **Dominio**: ¿El sitio irá en un dominio propio apuntando al CloudFront o se usa la URL de CloudFront directamente?
5. **AWS Region**: ¿Cuál región de AWS se usará? (ej. `us-east-1`, `sa-east-1` para Suramérica)
6. **Idioma**: ¿Solo español o también inglés?
7. **Colores/branding**: ¿Hay guía de marca o paleta de colores definida?
8. **Logo**: ¿Ya existe un logo o se crea uno placeholder?
9. **Analítica**: ¿Se integra Google Analytics u otro servicio desde el inicio?

---

## Success Criteria (Testables)

- [ ] `npm run build` termina sin errores ni warnings de budget
- [ ] Lighthouse Performance ≥ 85 en móvil (red 3G simulada)
- [ ] Formulario de contacto envía y muestra confirmación al usuario
- [ ] Todas las rutas cargan correctamente en mobile (320px)
- [ ] Sin errores en consola del navegador en producción
- [ ] URL pública accesible y funcional
- [ ] Tests unitarios pasan con ≥ 70% cobertura en servicios

---

*Este spec debe ser revisado y aprobado antes de iniciar la implementación (Phase 2: Plan).*
