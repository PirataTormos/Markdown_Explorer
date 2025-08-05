# Markdown Explorer

Un explorador y lector de documentos Markdown moderno con interfaz intuitiva y backend seguro.

## 🚀 Características

- **Explorador de archivos**: Navega fácilmente por la estructura de carpetas
- **Renderizado Markdown**: Visualización hermosa de contenido Markdown con soporte para:
  - GitHub Flavored Markdown (GFM)
  - Resaltado de sintaxis para código
  - Tablas, listas, enlaces e imágenes
  - Blockquotes y elementos HTML
- **Búsqueda avanzada**: Busca por nombre de archivo o contenido
- **Modo oscuro/claro**: Cambia entre temas según tu preferencia
- **Interfaz moderna**: Diseño limpio y responsivo con shadcn/ui
- **Backend seguro**: API protegida que previene acceso no autorizado

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **Markdown**: react-markdown, remark-gfm
- **Resaltado de código**: react-syntax-highlighter
- **Estado**: Zustand con persistencia
- **Temas**: next-themes

## 📦 Instalación

### Desarrollo Local

1. **Clona el repositorio**:
   \`\`\`bash
   git clone <repository-url>
   cd markdown-explorer
   \`\`\`

2. **Instala las dependencias**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Crea la carpeta de documentos**:
   \`\`\`bash
   mkdir Markdowns
   \`\`\`

4. **Inicia el servidor de desarrollo**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Abre tu navegador** en [http://localhost:3000](http://localhost:3000)

### Producción

1. **Construye la aplicación**:
   \`\`\`bash
   npm run build
   \`\`\`

2. **Inicia el servidor de producción**:
   \`\`\`bash
   npm start
   \`\`\`

## 📁 Estructura del Proyecto

\`\`\`
markdown-explorer/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   │   ├── files/         # Endpoint para estructura de archivos
│   │   ├── content/       # Endpoint para contenido de archivos
│   │   └── search/        # Endpoint para búsqueda
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx          # Página principal
├── components/            # Componentes React
│   ├── ui/               # Componentes de shadcn/ui
│   ├── app-sidebar.tsx   # Sidebar con explorador
│   ├── markdown-viewer.tsx # Visor de Markdown
│   ├── mode-toggle.tsx   # Toggle de tema
│   └── theme-provider.tsx # Proveedor de tema
├── lib/                  # Utilidades y configuración
│   └── store.ts          # Store de Zustand
├── Markdowns/            # Carpeta de documentos (se crea automáticamente)
└── README.md
\`\`\`

## 🔧 Configuración

### Carpeta de Documentos

Por defecto, la aplicación busca archivos en la carpeta \`Markdowns/\` en la raíz del proyecto. Puedes cambiar esta ubicación modificando las rutas en los archivos API:

\`\`\`typescript
// En app/api/files/route.ts y app/api/content/route.ts
const markdownsPath = path.join(process.cwd(), 'Markdowns')
\`\`\`

### Formatos Soportados

- \`.md\` - Archivos Markdown
- \`.mdx\` - Archivos MDX
- \`.txt\` - Archivos de texto plano

## 🔍 Uso

1. **Agregar documentos**: Coloca tus archivos Markdown en la carpeta \`Markdowns/\`
2. **Organizar**: Crea subcarpetas para organizar tus documentos
3. **Navegar**: Usa el sidebar para explorar la estructura de archivos
4. **Buscar**: Utiliza la barra de búsqueda para encontrar archivos específicos
5. **Leer**: Haz clic en cualquier archivo para ver su contenido renderizado

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno si es necesario
3. Despliega automáticamente

### Docker

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

### Servidor tradicional

1. Construye la aplicación: \`npm run build\`
2. Copia los archivos necesarios al servidor
3. Instala dependencias: \`npm ci --only=production\`
4. Inicia la aplicación: \`npm start\`

## 🔒 Seguridad

- **Validación de rutas**: Previene acceso a archivos fuera de la carpeta designada
- **Sanitización**: Contenido procesado de forma segura
- **CORS**: Configuración adecuada para producción

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit tus cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. Push a la rama (\`git push origin feature/AmazingFeature\`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo \`LICENSE\` para más detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

¡Disfruta explorando tus documentos Markdown! 📚✨
\`\`\`
