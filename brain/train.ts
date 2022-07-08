import * as tf from '@tensorflow/tfjs-node'
import {readdirSync, readFileSync, writeFileSync} from 'fs';
import {DataType} from '@tensorflow/tfjs-core/dist/types';
import { prepareFrames } from '..';
import { parseGIF, ParsedGif, decompressFrames } from 'gifuct-js';
import { input } from '@tensorflow/tfjs-node';

const model = tf.sequential();

const hidden = tf.layers.dense({
	units: 4,
	inputShape: [840, 420],
	activation: 'relu'
});
model.add(hidden);
model.add(tf.layers.flatten());

const output = tf.layers.dense({
	units: 1,
	activation: 'sigmoid'
});
model.add(output);

model.compile({
	loss: 'meanSquaredError',
	optimizer: tf.train.sgd(0.1)
});

const gifs = [
	"64382871",
	"64382936",
	"64383000",
	"64383031",
	"64383113",
	"64383236",
	"64383258",
	"64383263"
]

const trainingData: number[][][][] = new Array(gifs.length);
for (let i = 0; i < gifs.length; i++) {
	const gif = parseGIF(readFileSync(`./brain/training-data/${gifs[i]}.gif`));
	const frames = decompressFrames(gif, true);
	trainingData[i] = prepareFrames(gif.lsd.width, gif.lsd.height, frames);
}

train().then(() => {
	predict(readFileSync(`./brain/training-data/64382936.gif`));
})

export async function train() : Promise<void> {
	const xs: number[][][] = [];
	const ys: number[] = [];
	xs.push(trainingData[0][0].concat(trainingData[0][trainingData[0].length - 1]));
	ys.push(0.96);
	for (let i = 0; i < trainingData[0].length - 1; i++) {
		xs.push(trainingData[0][i].concat(trainingData[0][i + 1]));
		ys.push(0.96);
	}
	xs.push(trainingData[1][0].concat(trainingData[1][trainingData[1].length - 1]));
	ys.push(0.52);
	for (let i = 0; i < 31; i++) {
		xs.push(trainingData[1][i].concat(trainingData[1][i + 1]));
		ys.push(0.96);
	}
	xs.push(trainingData[1][31].concat(trainingData[1][32]));
	ys.push(0.92);
	for (let i = 32; i < trainingData[1].length - 1; i++) {
		xs.push(trainingData[1][i].concat(trainingData[1][i + 1]));
		ys.push(0.96);
	}
	xs.push(trainingData[2][0].concat(trainingData[2][trainingData[2].length - 1]));
	ys.push(0.64);
	for (let i = 0; i < 4; i++) {
		xs.push(trainingData[2][i].concat(trainingData[2][i + 1]));
		ys.push(0.8);
	}
	xs.push(trainingData[2][4].concat(trainingData[2][5]));
	ys.push(0.72)
	for (let i = 5; i < trainingData[2].length - 1; i++) {
		xs.push(trainingData[2][i].concat(trainingData[2][i + 1]));
		ys.push(0.8);
	}
	xs.push(trainingData[3][0].concat(trainingData[3][trainingData[3].length - 1]));
	ys.push(0.44)
	for (let i = 0; i < trainingData[3].length - 1; i++) {
		xs.push(trainingData[3][i].concat(trainingData[3][i + 1]));
		ys.push(0.88);
	}
	xs.push(trainingData[4][0].concat(trainingData[4][trainingData[4].length - 1]));
	ys.push(0.84)
	for (let i = 0; i < trainingData[4].length - 1; i++) {
		xs.push(trainingData[4][i].concat(trainingData[4][i + 1]));
		ys.push(0.96);
	}
	xs.push(trainingData[3][0].concat(trainingData[2][0]));
	ys.push(0.32);
	xs.push(trainingData[0][0].concat(trainingData[4][0]));
	ys.push(0.28);
	xs.push(trainingData[4][0].concat(trainingData[2][0]));
	ys.push(0.24);

	const xTensors = tf.tensor3d(xs);
	const yTensors = tf.tensor1d(ys);
	for (let i = 0; i < 10000; i++) {
		const response = await model.fit(xTensors, yTensors, {
			epochs: 10,
			shuffle: true,
			verbose: 0
		});
		console.log(response.history.loss[0]);
	}
}

export async function predict(buffer: Buffer) {
	const predictGif = parseGIF(buffer);
	const predictFrames = decompressFrames(predictGif, true);
	const preparedFrames = prepareFrames(predictGif.lsd.width, predictGif.lsd.height, predictFrames);
	const xs: number[][][] = [];
	xs.push(preparedFrames[0].concat(preparedFrames[preparedFrames.length - 1]));
	for (let i = 0; i < preparedFrames.length - 1; i++) {
		xs.push(preparedFrames[i].concat(preparedFrames[i + 1]));
	}
	const xTensors = tf.tensor3d(xs);
	
	const outputs = model.predict(xTensors) as tf.Tensor;
  console.log(outputs.dataSync())
}

// export default async function train() : Promise<void> {
    
//     const response = await model.fit(xs, ys, {
//         verbose: 1
//     });
//     console.log(response.history.loss[0]);


//     // const response = await model.fit(xs, ys, {
// //         epochs: 10,
// //         verbose: 0,
// //         shuffle: true
// //     });
// //     console.log(response.history.loss[0]);
    
// }

// // train().then(() => {
// //     const outputs = model.predict(xs) as any;
// //     console.log(outputs.dataSync())
// // })