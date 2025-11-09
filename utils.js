export function euclideanDistance(pointA, pointB) {
  let squareSum = 0;
  for (let i = 0; i < pointA.length; i++) {
    squareSum += (pointA[i] - pointB[i]) ** 2;
  }
  return Math.sqrt(squareSum);
}

export function dotProduct(vectorA, vectorB) {
  let sum = 0;
  for (let i = 0; i < vectorA.length; i++) {
    sum += vectorA[i] * vectorB[i];
  }
  return sum;
}

export function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

export default {
  dotProduct,
  sigmoid,
  euclideanDistance,
};
