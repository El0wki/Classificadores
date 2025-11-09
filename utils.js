export default function euclideanDistance(pointA, pointB) {
  let squareSum = 0;
  for (let i = 0; i < pointA.length; i++) {
    squareSum += (pointA[i] - pointB[i]) ** 2;
  }
  return Math.sqrt(squareSum);
}
