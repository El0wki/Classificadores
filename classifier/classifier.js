// ...existing code...
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

function analyzePredictions(neuron, inputsArray, ansKeys) {
  const mapping = {};

  for (let i = 0; i < inputsArray.length; i++) {
    const input = inputsArray[i];
    const realAns = ansKeys[i];
    const predFloat = neuron.forward(input);
    const pred = String(Math.round(predFloat)); // "0" or "1"

    if (!mapping[pred]) mapping[pred] = {};
    if (!mapping[pred][realAns]) mapping[pred][realAns] = 0;
    mapping[pred][realAns]++;
  }

  return mapping;
}

function runMultipleNeuronTrials(trainingSet, numTrials) {
  const allAccuracies = [];
  const epochs = 1000;

  let bestAccuracy = 0;
  let bestNeuron = null;

  console.log(`Iniciando ${numTrials} execuções de treinamento...`);

  for (let i = 0; i < numTrials; i++) {
    const neuron = new Neuron(4);
    for (let e = 0; e < epochs; e++) {
      for (const sample of trainingSet) {
        neuron.train(sample.inputs, sample.output);
      }
    }
    const runAccuracy = calculateNeuronAccuracy(neuron, trainingSet);
    allAccuracies.push(runAccuracy);

    if (runAccuracy > bestAccuracy) {
      bestAccuracy = runAccuracy;
      bestNeuron = neuron;
    }
  }

  console.log("Execuções finalizadas.");

  const sum = allAccuracies.reduce((acc, val) => acc + val, 0);
  const meanAccuracy = sum / numTrials;
  const worstAccuracy = Math.min(...allAccuracies);

  return {
    meanAccuracy,
    bestAccuracy,
    worstAccuracy,
    bestNeuron,
    allAccuracies,
  };
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

const numTrials = 1000;
const finalReport = runMultipleNeuronTrials(trainingSet, numTrials);

console.log(`--- Relatório Final Neurônio (após ${numTrials} execuções) ---`);
console.log(`Melhor Acurácia: ${(finalReport.bestAccuracy * 100).toFixed(2)}%`);
console.log(`Acurácia Média: ${(finalReport.meanAccuracy * 100).toFixed(2)}%`);
console.log(`Pior Acurácia: ${(finalReport.worstAccuracy * 100).toFixed(2)}%`);

console.log("\nMelhor Mapeamento Encontrado:");
const melhorTabela = analyzePredictions(finalReport.bestNeuron, xData, yLabels);
console.table(melhorTabela);
