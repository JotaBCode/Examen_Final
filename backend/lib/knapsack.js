function optimize(capacidad, objetos) {
  const n = objetos.length;
  const cap = Number(capacidad);

  const dp = Array.from({ length: n + 1 }, () => Array(cap + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const { peso, ganancia } = objetos[i - 1];
    for (let w = 0; w <= cap; w++) {
      dp[i][w] = dp[i - 1][w]; // no tomar i
      if (peso <= w) {
        const toma = dp[i - 1][w - peso] + ganancia;
        if (toma > dp[i][w]) dp[i][w] = toma;
      }
    }
  }

  let w = cap;
  const seleccionados = [];
  for (let i = n; i >= 1; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      const obj = objetos[i - 1];
      seleccionados.push(obj.nombre);
      w -= obj.peso;
    }
  }
  seleccionados.reverse();

  const ganancia_total = dp[n][cap];

  //Calculo peso_total real
  const names = new Set(seleccionados);
  let peso_total = 0;
  for (const o of objetos) if (names.has(o.nombre)) peso_total += o.peso;

  return { seleccionados, ganancia_total, peso_total };
}

module.exports = { optimize };
