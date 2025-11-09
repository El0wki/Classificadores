import Neuron from "./neuron.js";
import { data } from "../material_apoio/iris.js";

function calculateNeuronAccuracy(neuron, testData) {
  let correct = 0;
  for (const sample of testData) {
    const predictionFloat = neuron.forward(sample.inputs);
    const predictionBinary = Math.round(predictionFloat);
    if (predictionBinary === sample.output) correct++;
  }
  return correct / testData.length;
}

function runMultipleNeuronTrials(trainingSet, numTrials) {
  const allAccuracies = [];
  const epochs = 1000;
  console.log(`Starting ${numTrials} training runs...`);
  for (let i = 0; i < numTrials; i++) {
    const neuron = new Neuron(4);
    for (let e = 0; e < epochs; e++) {
      for (const sample of trainingSet) {
        neuron.train(sample.inputs, sample.output);
      }
    }
    const runAccuracy = calculateNeuronAccuracy(neuron, trainingSet);
    allAccuracies.push(runAccuracy);
  }
  console.log("Training runs finished.");
  const sum = allAccuracies.reduce((acc, val) => acc + val, 0);
  const meanAccuracy = sum / numTrials;
  const bestAccuracy = Math.max(...allAccuracies);
  const worstAccuracy = Math.min(...allAccuracies);
  return { meanAccuracy, bestAccuracy, worstAccuracy };
}

const xData = [];
const yLabels = [];
for (const line of data) {
  xData.push([
    parseFloat(line["sepal_length"]),
    parseFloat(line["sepal_width"]),
    parseFloat(line["petal_length"]),
    parseFloat(line["petal_width"]),
  ]);
  yLabels.push(line["species"]);
}

const trainingSet = [];
for (let i = 0; i < xData.length; i++) {
  trainingSet.push({
    inputs: xData[i],
    output: yLabels[i] === "Iris-setosa" ? 1 : 0,
  });
}

const numTrials = 27000;
const finalReport = runMultipleNeuronTrials(trainingSet, numTrials);

console.log(`--- Final Neuron Report (after ${numTrials} runs) ---`);
console.log(`Best Accuracy: ${(finalReport.bestAccuracy * 100).toFixed(2)}%`);
console.log(`Mean Accuracy: ${(finalReport.meanAccuracy * 100).toFixed(2)}%`);
console.log(`Worst Accuracy: ${(finalReport.worstAccuracy * 100).toFixed(2)}%`);
