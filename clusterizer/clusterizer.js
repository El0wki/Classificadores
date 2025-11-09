import { data } from "../material_apoio/iris.js";
import { kmeans } from "./kMeans.js";

function analyzeClusters(attributed, ansKey) {
  const mapping = {};

  for (let i = 0; i < attributed.length; i++) {
    const clusterNum = attributed[i];
    const realAns = ansKey[i];

    if (!mapping[clusterNum]) {
      mapping[clusterNum] = {};
    }
    if (!mapping[clusterNum][realAns]) {
      mapping[clusterNum][realAns] = 0;
    }
    mapping[clusterNum][realAns]++;
  }

  return mapping;
}

function calcAccuracy(analyzedClusters, totalPoints) {
  let totalCorrect = 0;

  for (const clusterNum in analyzedClusters) {
    const count = analyzedClusters[clusterNum];

    let maxClusterCorrect = 0;

    for (const label in count) {
      if (count[label] > maxClusterCorrect) {
        maxClusterCorrect = count[label];
      }
    }

    totalCorrect += maxClusterCorrect;
  }

  return totalCorrect / totalPoints;
}

function executeMultipleTimes(iris_data, iris_ans_keys, k, numsExecuted) {
  let bestAccuracy = 0;
  let bestResult = {
    attributed: [],
    centroids: [],
  };

  const allAccuracies = [];
  const totalPoints = iris_data.length;

  console.log(`Iniciando ${numsExecuted} execuções de K-Means...`);

  for (let i = 0; i < numsExecuted; i++) {
    const result = kmeans(iris_data, k);

    const analyzedClusters = analyzeClusters(result.attributed, iris_ans_keys);

    const acuraciaRun = calcAccuracy(analyzedClusters, totalPoints);
    allAccuracies.push(acuraciaRun);

    if (acuraciaRun > bestAccuracy) {
      bestAccuracy = acuraciaRun;
      bestResult.attributed = result.attributed;
      bestResult.centroids = result.centroids;
    }
  }

  const accuratedSum = allAccuracies.reduce((acc, val) => acc + val, 0);
  const averageAccuracy = accuratedSum / numsExecuted;
  const worstAccuracy = Math.min(...allAccuracies);

  console.log("Execuções finalizadas.");

  return {
    averageAccuracy: averageAccuracy,
    bestAccuracy: bestAccuracy,
    worstAccuracy: worstAccuracy,
    bestResult: bestResult,
  };
}

const iris_data = [];
const iris_ans_keys = [];

for (const line of data) {
  iris_data.push([
    parseFloat(line["sepal_length"]),
    parseFloat(line["sepal_width"]),
    parseFloat(line["petal_length"]),
    parseFloat(line["petal_width"]),
  ]);

  iris_ans_keys.push(line["species"]);
}

const k = 3;
const numTestes = 23000;

const relatorioFinal = executeMultipleTimes(
  iris_data,
  iris_ans_keys,
  k,
  numTestes
);

console.log(`--- Relatório Final K-Means (após ${numTestes} execuções) ---`);
console.log(
  `Melhor Acurácia Encontrada: ${(relatorioFinal.bestAccuracy * 100).toFixed(
    2
  )}%`
);
console.log(
  `Acurácia Média: ${(relatorioFinal.averageAccuracy * 100).toFixed(2)}%`
);
console.log(
  `Pior Acurácia Encontrada: ${(relatorioFinal.worstAccuracy * 100).toFixed(
    2
  )}%`
);

console.log("\nMelhor Mapeamento Encontrado:");
const melhorTabela = analyzeClusters(
  relatorioFinal.bestResult.attributed,
  iris_ans_keys
);

console.table(melhorTabela);
