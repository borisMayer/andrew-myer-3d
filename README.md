# Andrew Myer — Página Oficial 3D
### Serie "Navegando por el Océano del Infinito"

Sitio web 3D inmersivo para el autor espiritual y metafísico Andrew Myer.

---

## Stack técnico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Vite | 5.x | Bundler ultrarrápido |
| React 18 | 18.x | UI framework |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 3.x | Utilidades CSS |
| Three.js | 0.169 | Motor 3D |
| @react-three/fiber | 8.x | React + Three.js |
| @react-three/drei | 9.x | Helpers 3D (Text, Float, etc.) |
| @react-three/postprocessing | 2.x | Bloom, Vignette, ChromaticAberration |
| @react-three/rapier | 1.x | Física (partículas) |
| GSAP | 3.x | Animaciones y scroll |

---

## Instalación paso a paso

### 1. Requisitos previos
- Node.js **18+** (recomendado 20 LTS)
- npm 9+ o pnpm 8+

### 2. Clonar / descargar el proyecto
```bash
# Si usas git
git clone <repo-url> andrew-myer-3d
cd andrew-myer-3d

# O simplemente entrar a la carpeta del proyecto
cd andrew-myer-3d
```

### 3. Instalar dependencias
```bash
npm install
```
> ⚠️ La primera instalación puede tardar 2-3 minutos por las dependencias de Three.js

### 4. Correr en desarrollo
```bash
npm run dev
```
Abre automáticamente en **http://localhost:5173**

### 5. Build para producción
```bash
npm run build
```
Los archivos optimizados quedan en `/dist`

### 6. Preview del build
```bash
npm run preview
```

---

## Estructura del proyecto

```
andrew-myer-3d/
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── HeroScene.tsx        ← Canvas principal con todo el 3D
│   │   │   ├── NebulaBackground.tsx ← Cielo cósmico con shader
│   │   │   ├── CosmicPortal.tsx     ← Portal giratorio del hero
│   │   │   ├── CosmicParticles.tsx  ← Campo de partículas
│   │   │   ├── FloatingCrystal.tsx  ← Cristales flotantes + clusters
│   │   │   ├── BookMesh.tsx         ← Libro 3D interactivo
│   │   │   └── SceneEffects.tsx     ← Bloom, Vignette, ChromaticAberration
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx      ← Overlay HTML del hero
│   │   │   ├── AuthorSection.tsx    ← Biografía del autor
│   │   │   └── BooksSection.tsx     ← Catálogo de libros 2D (con modal 3D)
│   │   └── ui/
│   │       ├── Navigation.tsx       ← Barra de navegación
│   │       ├── BookModal.tsx        ← Modal 3D del libro seleccionado
│   │       └── MobileWarning.tsx    ← Fallback 2D para móvil
│   ├── hooks/
│   │   └── useScroll.ts             ← Scroll progress + mouse position
│   ├── lib/
│   │   └── books.ts                 ← Catálogo de libros (datos)
│   ├── App.tsx                      ← Componente raíz
│   ├── main.tsx                     ← Entry point
│   └── index.css                    ← Estilos globales + Tailwind
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Personalización

### Agregar/modificar libros
Editar `src/lib/books.ts`:
```typescript
{
  id:         'mi-libro',
  titleEs:    'Título en Español',
  titleEn:    'Title in English',
  subtitle:   'Subtítulo del libro',
  series:     'Navegando por el Océano del Infinito',
  coverColor: '#1a0533',   // color dominante de la portada
  spineColor: '#0d0224',   // color del lomo
  glowColor:  '#9333ea',   // color del glow/aura
  amazonUrl:  'https://amazon.com/dp/ASIN_REAL',
  description: 'Descripción del libro...',
}
```

### Reemplazar foto del autor
En `src/components/sections/AuthorSection.tsx`, buscar el comentario:
```tsx
{/* Replace this div with <img src="/author-photo.jpg" /> */}
```
Colocar la foto en `/public/author-photo.jpg` y reemplazar el div por:
```tsx
<img
  src="/author-photo.jpg"
  alt="Andrew Myer"
  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
/>
```

### Links de Amazon reales
Reemplazar todos los `REPLACE_ASIN_X` en `src/lib/books.ts` con los ASINs reales de Amazon.

### Modelos 3D GLTF (opcional)
Para reemplazar los libros con modelos 3D reales:
1. Exportar el modelo como `.glb` y colocarlo en `/public/models/`
2. En `BookMesh.tsx`, usar `useGLTF` de `@react-three/drei`:
```tsx
import { useGLTF } from '@react-three/drei';
const { scene } = useGLTF('/models/mi-libro.glb');
return <primitive object={scene} />;
```

---

## Performance

- **Code splitting automático**: Three.js, física y postprocessing se cargan en chunks separados
- **Lazy loading**: El canvas 3D se carga con `React.lazy`
- **Mobile fallback**: Dispositivos sin WebGL o móviles reciben una versión 2D optimizada
- **Suspense boundaries**: Loading screen mientras carga la escena 3D

---

## Notas técnicas

- El canvas 3D está en `position: fixed` para crear el efecto de parallax con el scroll
- GSAP ScrollTrigger controla las animaciones sincronizadas con el scroll
- Las fuentes se cargan desde Google Fonts (Cormorant Garamond + Raleway)
- Los efectos de postprocessing (Bloom) son los responsables del glow místico

---

*Desarrollado con ❤️ para Andrew Myer — 2026*
