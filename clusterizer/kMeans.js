import { euclideanDistance } from "../utils.js";

const _initCentroids = (data, k) => {
  const centroids = [];
  const usedIndexes = new Set();
  while (centroids.length < k) {
    const randomIndex = Math.floor(Math.random() * data.length);
    if (!usedIndexes.has(randomIndex)) {
      usedIndexes.add(randomIndex);
      centroids.push([...data[randomIndex]]);
    }
  }
  return centroids;
};

const _attributeClusters = (data, centroids) => {
  const attributed = [];
  for (const point of data) {
    let smallerDistance = Infinity;
    let closestCluster = -1;
    for (let i = 0; i < centroids.length; i++) {
      const currentCentroid = centroids[i];
      const distance = euclideanDistance(point, currentCentroid);
      if (distance < smallerDistance) {
        smallerDistance = distance;
        closestCluster = i;
      }
    }
    attributed.push(closestCluster);
  }
  return attributed;
};

const _updateCentroids = (data, attributed, k, oldCentroids) => {
  const numDimensions = data[0].length;
  const clusterSum = new Array(k);
  for (let i = 0; i < k; i++) {
    clusterSum[i] = new Array(numDimensions).fill(0);
  }
  const clusterCount = new Array(k).fill(0);

  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const clusterIndex = attributed[i];
    if (clusterIndex == null || clusterIndex < 0 || clusterIndex >= k) continue;
    clusterCount[clusterIndex]++;
    for (let j = 0; j < numDimensions; j++) {
      clusterSum[clusterIndex][j] += point[j];
    }
  }

  const newCentroids = new Array(k);
  for (let i = 0; i < k; i++) {
    if (clusterCount[i] === 0) {
      newCentroids[i] =
        oldCentroids && oldCentroids[i] ? oldCentroids[i] : clusterSum[i];
    } else {
      newCentroids[i] = clusterSum[i].map((sum) => sum / clusterCount[i]);
    }
  }
  return newCentroids;
};

export const kmeans = (data, k, maxIteractions = 1000) => {
  if (k > data.length) k = data.length;

  let centroids = _initCentroids(data, k);
  let attributed = [];

  for (let iter = 0; iter < maxIteractions; iter++) {
    attributed = _attributeClusters(data, centroids);
    const newCentroids = _updateCentroids(data, attributed, k, centroids);
    let changed = false;
    for (let i = 0; i < centroids.length; i++) {
      if (euclideanDistance(centroids[i], newCentroids[i]) > 0.001) {
        changed = true;
        break;
      }
    }
    centroids = newCentroids;
    if (!changed) {
      break;
    }
  }
  return { centroids, attributed };
};
