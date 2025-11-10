// ...existing code...
import { kmeans } from "./clusterizer/kMeans.js";
import { irisData } from "./material_apoio/iris.js";
import test from "./clusterizer/test.js";
import { performance } from "perf_hooks";
// ...existing code...

const data = [];
const ans = [];

for (const line of irisData) {
  data.push([
    parseFloat(line["sepal_length"]),
    parseFloat(line["sepal_width"]),
    parseFloat(line["petal_length"]),
    parseFloat(line["petal_width"]),
  ]);

  ans.push(line["species"]);
}

// configuração: ajuste repeat conforme necessário (cuidado com tempo total)
const repeat = 100; // número de repetições por k
const kStart = 1;
const kEnd = 1000;

const allResults = [];
const globalStart = performance.now();

for (let k = kStart; k <= kEnd; k++) {
  const actualK = Math.min(k, data.length); // k não pode ser maior que número de pontos
  const accuracies = [];
  const times = [];
  const startK = performance.now();

  for (let i = 0; i < repeat; i++) {
    const iterStart = performance.now();

    const cluster = kmeans(data, actualK);
    const analyzedClusters = test.analyzeClusters(cluster.attributed, ans);
    const accurate = test.calcAccuracy(analyzedClusters, data.length);
    accuracies.push(accurate);

    const iterEnd = performance.now();
    times.push(iterEnd - iterStart);
  }

  const endK = performance.now();

  const sum = accuracies.reduce((s, v) => s + v, 0);
  const avg = sum / accuracies.length;
  const best = Math.max(...accuracies);
  const worst = Math.min(...accuracies);

  const timeSum = times.reduce((s, v) => s + v, 0);
  const timeAvg = timeSum / times.length;
  const timeBest = Math.min(...times);
  const timeWorst = Math.max(...times);
  const totalTimeK = endK - startK;

  const result = {
    k,
    actualK,
    avg,
    best,
    worst,
    timeAvg,
    timeBest,
    timeWorst,
    totalTimeK,
    runs: repeat,
  };

  allResults.push(result);

  console.log(
    `k=${k} (use ${actualK}) → runs: ${repeat}, avg: ${avg.toFixed(
      4
    )}, best: ${best.toFixed(4)}, time avg(ms): ${timeAvg.toFixed(
      3
    )}, totalK(ms): ${totalTimeK.toFixed(1)}`
  );
}

const globalEnd = performance.now();
const totalElapsed = globalEnd - globalStart;

let bestByAvg = allResults[0];
let bestBySingle = allResults[0];
for (const r of allResults) {
  if (r.avg > bestByAvg.avg) bestByAvg = r;
  if (r.best > bestBySingle.best) bestBySingle = r;
}

console.log("\nSUMMARY:");
console.log(
  `best average -> k=${bestByAvg.k} (actual ${
    bestByAvg.actualK
  }), avg=${bestByAvg.avg.toFixed(4)}, best=${bestByAvg.best.toFixed(4)}`
);
console.log(
  `best single run -> k=${bestBySingle.k} (actual ${
    bestBySingle.actualK
  }), best=${bestBySingle.best.toFixed(4)}`
);
console.log(`total elapsed all ks (ms): ${totalElapsed.toFixed(1)}`);
