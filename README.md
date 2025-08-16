# Universidad de las Fuerzas Armadas ESPE  
## Departamento de Ciencias de la Computación  
### Carrera de Ingeniería en Tecnologías de la Información - En Línea  
**Arquitectura de Software**  
**Examen Final**  
**Docente:** Ing. Geovanny Cudco  
**Nombre:** Jhon Antony Bedoya Dávalos  
**NRC:** 23447  
**Fecha:** 15 de agosto de 2025  

---

# Examen Final – Microservicio de Optimización de Portafolio

Este proyecto implementa un **microservicio de optimización de portafolio** basado en el problema de la **mochila 0/1 (Knapsack)**, con un **frontend web** para interactuar con la API.  

Cumple con los entregables del examen:  
- Endpoint `/optimizar` (POST).  
- Validaciones de entrada.  
- Algoritmo óptimo con **programación dinámica (DP)**.  
- Frontend con formulario dinámico para ingresar proyectos.  
- Visualización de resultados en **tarjeta, tabla y gráfico (Chart.js)**.  
- Documentación **OpenAPI**.  
- Soporte de **Docker** y **docker-compose** para despliegue.  

---

## 📦 Requisitos
- Node.js 18+  
- (Opcional) Docker  
- (Opcional) `http-server` para servir frontend  

---

## 📂 Estructura del proyecto
```
Examen_Final/
│── backend/          # Microservicio Node + Express
│   ├── lib/knapsack.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── openapi.yaml   # Documentación OpenAPI
│
│── frontend/         # Interfaz web (HTML + JS + Chart.js CDN)
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   ├── favicon.ico
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## 🚀 Ejecución del Backend
```bash
cd backend
npm install
npm start
# Servidor en http://localhost:3000
```

### Probar API con cURL
```bash
curl -X POST http://localhost:3000/optimizar   -H "Content-Type: application/json"   -d '{
    "capacidad": 10000,
    "objetos": [
      {"nombre":"A","peso":2000,"ganancia":1500},
      {"nombre":"B","peso":4000,"ganancia":3500},
      {"nombre":"C","peso":5000,"ganancia":4000},
      {"nombre":"D","peso":3000,"ganancia":2500}
    ]
  }'
```

---

## 💻 Ejecución del Frontend

### Opción 1: abrir directo
Abrir `frontend/index.html` en el navegador.

### Opción 2: servir con http-server
```bash
cd frontend
npx http-server -p 5173
# Abrir en http://localhost:5173
```

---

## 🐳 Ejecución con Docker

### Backend
```bash
cd backend
docker build -t examen-backend .
docker run --rm -p 3000:3000 examen-backend
```

### Frontend (con Nginx)
```bash
cd frontend
docker build -t examen-frontend .
docker run --rm -p 5173:80 examen-frontend
# Abrir en http://localhost:5173
```

### Docker Compose (levantar todo junto)
```bash
docker compose up --build
# Backend -> http://localhost:3000
# Frontend -> http://localhost:5173
```

---

## 📑 Documentación API
Archivo: `backend/openapi.yaml`  
Importable en **Swagger UI**, **Postman** o **Insomnia**.

---

## ✅ Casos de Prueba (oficiales del enunciado)
- **Caso Éxito 1**  
  - capacidad = 10000  
  - seleccionados = [ "Fondo_B", "Fondo_C", "Fondo_E" ]  
  - ganancia_total = 9300  
  - peso_total = 10000  

- **Caso Éxito 2**  
  - capacidad = 8000  
  - seleccionados = [ "Acción_Y", "Acción_Z", "Bono_Q" ]  
  - ganancia_total = 6200  
  - peso_total = 7000  

- **Caso Éxito 3**  
  - capacidad = 5000  
  - seleccionados = [ "Cripto_1", "Cripto_2", "ETF_2", "ETF_1" ]  
  - ganancia_total = 4800  
  - peso_total = 5000  

---

## ✨ Conclusiones
- El microservicio cumple con los requisitos de **validación, eficiencia y modularidad**.  
- El frontend permite una interacción amigable con **tabla, resumen y gráfico**.  
- El proyecto es fácilmente **portable y desplegable** gracias a Docker. 
