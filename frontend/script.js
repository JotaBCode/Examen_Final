const API_URL = 'http://localhost:3000/optimizar';

const projectsList = document.getElementById('projects-list');
const capacidadInput = document.getElementById('capacidad');
const btnAdd = document.getElementById('add-project');
const btnCalc = document.getElementById('btn-calcular');
const btnClear = document.getElementById('btn-limpiar');
const resultCard = document.getElementById('result-card');
const tbody = document.querySelector('#tabla-resultados tbody');

const btnEjemplo = document.getElementById('btn-ejemplo');
const btnCaso1 = document.getElementById('btn-caso1');
const btnCaso2 = document.getElementById('btn-caso2');
const btnCaso3 = document.getElementById('btn-caso3');

let chart;

function addRow(nombre = '', peso = '', ganancia = '') {
  const row = document.createElement('div');
  row.className = 'project-row';
  row.innerHTML = `
    <input type="text" placeholder="ID" value="${nombre}">
    <input type="number" placeholder="Costo" min="0" value="${peso}">
    <input type="number" placeholder="Ganancia" value="${ganancia}">
    <button class="remove">Eliminar</button>
  `;
  row.querySelector('.remove').onclick = () => row.remove();
  projectsList.appendChild(row);
}

btnAdd.onclick = () => addRow();

btnClear.onclick = () => {
  capacidadInput.value = '';
  projectsList.innerHTML = '';
  resultCard.innerHTML = '';
  tbody.innerHTML = '';
  if (chart) chart.destroy();
};

btnEjemplo.onclick = () => {
  btnClear.click();
  capacidadInput.value = 10000;
  [['A',2000,1500], ['B',4000,3500], ['C',5000,4000], ['D',3000,2500]].forEach(x => addRow(...x));
};

btnCaso1.onclick = () => {
  btnClear.click();
  capacidadInput.value = 10000;
  [
    ['Fondo_A',2000,1500],
    ['Fondo_B',4000,3500],
    ['Fondo_C',5000,4000],
    ['Fondo_D',3000,2500],
    ['Fondo_E',1500,1800]
  ].forEach(x => addRow(...x));
};

btnCaso2.onclick = () => {
  btnClear.click();
  capacidadInput.value = 8000;
  [
    ['Acción_X',1000,800],
    ['Acción_Y',2500,2200],
    ['Acción_Z',3000,2800],
    ['Bono_P',4000,3000],
    ['Bono_Q',1500,1200]
  ].forEach(x => addRow(...x));
};

btnCaso3.onclick = () => {
  btnClear.click();
  capacidadInput.value = 5000;
  [
    ['Cripto_1',500,700],
    ['Cripto_2',800,1000],
    ['ETF_1',1500,1300],
    ['ETF_2',2000,1800],
    ['NFT_Alpha',3000,2500]
  ].forEach(x => addRow(...x));
};

btnCalc.onclick = async () => {
  const capacidad = Number(capacidadInput.value);
  const objetos = Array.from(projectsList.children).map(row => {
    const [nombre, peso, ganancia] = row.querySelectorAll('input');
    return {
      nombre: nombre.value.trim(),
      peso: Number(peso.value),
      ganancia: Number(ganancia.value)
    };
  });

  try {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ capacidad, objetos })
    });

    const data = await resp.json();

    if (!resp.ok) {
      alert('Errores:\n' + (data.errors ? data.errors.join('\n') : JSON.stringify(data)));
      return;
    }

    // Pintar card y tabla
    resultCard.innerHTML = `
      <div><div>Seleccionados</div><div class="value">{ ${data.seleccionados.join(', ')} }</div></div>
      <div><div>Ganancia total</div><div class="value">${data.ganancia_total}</div></div>
      <div><div>Peso total</div><div class="value">${data.peso_total}</div></div>
    `;
    tbody.innerHTML = `
      <tr>
        <td>{ ${data.seleccionados.join(', ')} }</td>
        <td>${data.ganancia_total}</td>
        <td>${data.peso_total}</td>
      </tr>
    `;

    // Gráfico opcional
    const labels = objetos.map(o => o.nombre || '(sin ID)');
    const costos = objetos.map(o => o.peso || 0);
    const ganancias = objetos.map(o => o.ganancia || 0);

    const ctx = document.getElementById('chart').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Costo', data: costos },
          { label: 'Ganancia', data: ganancias }
        ]
      }
    });

  } catch (e) {
    console.error(e);
    alert('No se pudo conectar con el backend. Asegura que corre en http://localhost:3000');
  }
};

// Arranca con una fila por defecto
addRow();
