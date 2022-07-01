import * as tf from '@tensorflow/tfjs-node'
import {readdirSync, readFileSync, writeFileSync} from 'fs';
import {DataType} from '@tensorflow/tfjs-core/dist/types';
import { prepareFrames } from '..';
import { parseGIF, ParsedGif, decompressFrames } from 'gifuct-js';
import { input } from '@tensorflow/tfjs-node';

const model = tf.sequential();

const hidden = tf.layers.dense({
    units: 4,
    inputShape: [600, 480, 3],
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
    "64383236"
]
const trainingData: number[][][][] = new Array(gifs.length);
for (let i = 0; i < gifs.length; i++) {
    const gif = parseGIF(readFileSync(`./brain/training-data/${gifs[i]}.gif`));
    const frames = decompressFrames(gif, true);
    trainingData[i] = prepareFrames(frames[1].delay, gif.lsd.width, gif.lsd.height, frames);
}

console.log(trainingData.length);

// console.log(tf.tensor(getAllPixelData(frames[1].delay, gif.lsd.width, gif.lsd.height, frames)).shape)
// getAllPixelData(frames[1].delay, gif.lsd.width, gif.lsd.height, frames);
// console.log(tf.node.decodeGif(readFileSync(`./brain/training-data/64382871.gif`)).as1D())
const xs = tf.tensor([]);



// [
    

//     // tf.node.decodeGif(readFileSync(`./brain/training-data/64382871.gif`)),
//     // tf.node.decodeGif(readFileSync(`./brain/training-data/64382936.gif`)),
//     // tf.node.decodeGif(readFileSync(`./brain/training-data/64383000.gif`)),
//     // tf.node.decodeGif(readFileSync(`./brain/training-data/64383031.gif`)),
//     // tf.node.decodeGif(readFileSync(`./brain/training-data/64383113.gif`)),
//     // tf.node.decodeGif(readFileSync(`./brain/training-data/64383236.gif`))
// ];
// console.log(tf.tensor3d(getAllPixelData(frames[1].delay, gif.lsd.width, gif.lsd.height, frames)).shape)

    
    // getAllPixelData(frames[1].delay, gif.lsd.width, gif.lsd.height, frames),

    // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64382936.gif`)), true)),
    // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64383000.gif`)), true)),
    // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64383031.gif`)), true)),
    // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64383113.gif`)), true)),
    // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64383236.gif`)), true)),

//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64383258.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64383263.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64383326.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64383421.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64383608.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64383638.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64383651.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64384226.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64384316.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64384700.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64384889.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64384960.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64385153.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64385246.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64385257.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64385308.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64385311.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64385416.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64385428.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64385545.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64385547.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64385551.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64385555.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64385563.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/64385564.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/643828782.gif`)), true)),
//     // getAllPixelData(decompressFrames(parseGIF(readFileSync(`./brain/training-data/6438333903.gif`)), true))
// ]);
// console.log(xs)

// const ys = [
//     tf.tensor1d([0.98]),
//     // 0.3,
//     // 0.3,
//     // 0.1,
//     // 0.94,
//     // 0,
//     // 0.2,
//     // 0.2,
//     // 0.2,
//     // 0.9,
//     // 0.4,
//     // 0.5,
//     // 0.8,
//     // 0.4,
//     // 0.3,
//     // 0.2,
//     // 0,
//     // 1,
//     // 0.7,
//     // 0.85,
//     // 0.4,
//     // 0.9,
//     // 0.7,
//     // 0.85,
//     // 0.6,
//     // 0.75,
//     // 0.3,
//     // 0.6,
//     // 0.85,
//     // 0.5,
//     // 0.4,
//     // 0.7,
//     // 0.7
// ];
// // console.log(ys)

// train();

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

// function getGifs(path: string) {
//     // const gifs = [];


// //     // return gifs;
// }