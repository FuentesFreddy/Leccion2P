# Despliegue de CV Estático con Docker - Freddy Fuentes

## Descripción del proyecto
Leccion 2P

## Estructura de carpetas
- [cite_start]`index.html`: Código fuente del sitio con estilos CSS integrados[cite: 104].
- [cite_start]`CSS/styles2P.css`: Código fuente del sitio con estilos CSS integrados[cite: 104].
- [cite_start]`JS/app.js`: Código fuente del sitio con estilos CSS integrados[cite: 104].
- [cite_start]`Dockerfile`: Archivo de configuración para la construcción de la imagen[cite: 105].
- [cite_start]`.dockerignore`: Define los archivos excluidos del contexto de Docker[cite: 105].

## Instrucciones para ejecución local

### 1. Construir la imagen
Desde la terminal, en la raíz del proyecto, ejecuta:
```bash
docker build -t fjfuentes1/leccion2p:latest .
```

### 2. Ejecutar el contenedor
Para iniciar el sitio en el puerto 8080:
```bash
docker run -d -p 8080:80 --name portal-espe fjfuentes1/leccion2p:latest
```

### 3. Acceder al sitio
Abre tu navegador e ingresa a: http://localhost:8080

### Imagen en Docker Hub
* Comando para descargar la imagen (Pull):
```bash
docker pull fjfuentes1/leccion2p:latest
```
* Comando para ejecutar el contenedor desde la imagen pública:
```bash
docker run -d -p 8080:80 --name portal-espe fjfuentes1/leccion2p:latest
```