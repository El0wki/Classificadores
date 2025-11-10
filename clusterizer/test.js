import { kmeans } from "./kMeans.js";

export function analyzeClusters(attributed, ansKey) {
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

export function calcAccuracy(analyzedClusters, totalPoints = 150) {
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

export default {
  analyzeClusters,
  calcAccuracy,
};
