const express = require('express');
const cors = require('cors');
const { optimize } = require('./lib/knapsack');

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

//CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(cors());
app.use(express.json());

//Healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));

//validaciones
function validateBody(body) {
  const errors = [];

  if (body == null || typeof body !== 'object') {
    errors.push('Cuerpo ausente o inválido.');
    return errors;
  }

  const { capacidad, objetos } = body;

  //capacidad
  if (capacidad == null || isNaN(Number(capacidad))) {
    errors.push('capacidad es requerida y debe ser numérica.');
  } else if (Number(capacidad) < 0) {
    errors.push('capacidad no puede ser negativa.');
  } else if (!Number.isInteger(Number(capacidad))) {
    errors.push('capacidad debe ser entero.');
  }

  //objetos
  if (!Array.isArray(objetos)) {
    errors.push('objetos debe ser un arreglo.');
  } else {
    objetos.forEach((o, idx) => {
      if (!o || typeof o !== 'object') {
        errors.push(`objetos[${idx}] inválido.`);
        return;
      }
      if (typeof o.nombre !== 'string' || o.nombre.trim() === '') {
        errors.push(`objetos[${idx}].nombre es requerido (string no vacío).`);
      }
      if (o.peso == null || isNaN(Number(o.peso)) || Number(o.peso) < 0 || !Number.isInteger(Number(o.peso))) {
        errors.push(`objetos[${idx}].peso debe ser entero >= 0.`);
      }
      if (o.ganancia == null || isNaN(Number(o.ganancia)) || !Number.isInteger(Number(o.ganancia))) {
        errors.push(`objetos[${idx}].ganancia debe ser entero (>= 0 recomendado).`);
      }
    });
  }

  return errors;
}

//Endpoint principal
app.post('/optimizar', (req, res) => {
  try {
    const errors = validateBody(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const capacidad = Number(req.body.capacidad);
    const objetos = req.body.objetos.map(o => ({
      nombre: String(o.nombre),
      peso: Number(o.peso),
      ganancia: Number(o.ganancia)
    }));

    const result = optimize(capacidad, objetos);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
