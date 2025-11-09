import { dotProduct, sigmoid } from "../utils.js";

export default class Neuron {
  constructor(numInputs) {
    this.weights = new Array(numInputs)
      .fill(0)
      .map(() => Math.random() * 2 - 1);
    this.bias = Math.random() * 2 - 1;
  }

  forward(inputs) {
    const weightedSum = dotProduct(inputs, this.weights);
    const total = weightedSum + this.bias;
    return sigmoid(total);
  }

  train(inputs, correctAns) {
    const prediction = this.forward(inputs);
    const dError = prediction - correctAns;
    const dPrediction = prediction * (1 - prediction);
    const guilt = dError - dPrediction;
    const learnRate = 0.1;
    for (let i = 0; i < this.weights.length; i++) {
      const dWeight = guilt * inputs[i];
      this.weights[i] -= learnRate * dWeight;
    }
    this.bias -= learnRate * guilt;
  }
}
