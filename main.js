import { kmeans } from "./clusterizer/kMeans.js";
import { irisData } from "./material_apoio/iris.js";
import test from "./clusterizer/test.js";
import { performance } from "perf_hooks";

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

const repeat = 10000;
const k = 3;
let accurate = [];
for (let i = 0; i < repeat; i++) {
  const clusters = kmeans(data, k);
  const analyzed = test.analyzeClusters(clusters.attributed, ans);
  accurate.push(test.calcAccuracy(analyzed));
}

const stats = accurate.reduce(
  (acc, v) => {
    if (v < acc.min) acc.min = v;
    if (v > acc.max) acc.max = v;
    acc.count += 1;
    acc.avg = acc.avg + (v - acc.avg) / acc.count;
    return acc;
  },
  { min: Infinity, avg: 0, max: -Infinity, count: 0 }
);

const formatPct = (v) =>
  v == null
    ? ""
    : v.toLocaleString(undefined, {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

const summary = {
  runs: stats.count,
  min_fraction: Number(stats.min.toFixed(6)),
  avg_fraction: Number(stats.avg.toFixed(6)),
  max_fraction: Number(stats.max.toFixed(6)),
  min_percent: formatPct(stats.min),
  avg_percent: formatPct(stats.avg),
  max_percent: formatPct(stats.max),
};

console.log("SUMMARY (overall):");
console.table(summary);
