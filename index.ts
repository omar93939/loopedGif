import { decompressFrames, ParsedFrame, parseGIF } from "gifuct-js";

export default function isLoopedGIF(data: Buffer) {
	const gif = parseGIF(data);
	if (gif.lsd.width < 420 && gif.lsd.height < 420) return false;
	const frames = decompressFrames(gif, true);
	const delay = frames[1].delay;
	if (delay > 80 || delay < 5) return false;
	if (frames.length < 5) return false;

	console.log("!!!!!!!!!!!!!!!!!!")
	// getAllPixelData(frames);

	return true;
}

// export function getAllPixelData(frames: ParsedFrame[]) {
// 	const grayArray: number[][] = [];
// 	for (let i = 0; i < frames.length; i++) {
// 		const patch = frames[i].patch;
// 		const patchArray: number[] = [];
// 		for (let j = 0; j < patch.length; j+=4) {
// 			patchArray.push(Math.floor((patch[j] + patch[j + 1] + patch[j + 2]) / 3));
// 		}
// 		grayArray.push(patchArray);
// 	}
// 	return grayArray;
// }

// Fast ParsedFrame.patch array to 420x420 Grayscale pixeldata array (~100ms/30frames of 480x600px gif)
export function prepareFrames(delay: number, width: number, height: number, frames: ParsedFrame[]) {
	const grayArray: [number, number[][]][] = new Array(frames.length);
	for (let i = 0; i < frames.length; i++) {
		const patch = frames[i].patch;
		const imgData: number[][] = new Array(height);
		const frameWidth = frames[i].dims.width;
		const frameHeight = frames[i].dims.height;
		const left = frames[i].dims.left;
		const right = width - frameWidth - left;
		const top = frames[i].dims.top;
		const bottom = height - frameHeight - top;
		const totalFrameWidth = frameWidth * 4;
		if (top) {
			for (let y = 0; y < top; y++) {
				imgData[y] = grayArray[i - 1][1][y];
			}
		}
		for (let y = 0; y < patch.length; y+=totalFrameWidth) {
			const row: number[] = new Array(width);
			const currentYIndex = top + (y / totalFrameWidth);
			if (left) {
				for (let x = 0; x < left; x++) {
					row[x] = grayArray[i - 1][1][currentYIndex][x];
				}
			}
			for (let x = y, endX = x + totalFrameWidth; x < endX; x+=4) {
				const currentXIndex = left + ((x - y) >>> 2);
				if (patch[x + 3] == 0) {
					row[currentXIndex] = grayArray[i - 1][1][currentYIndex][currentXIndex];
				} else {
					row[currentXIndex] = Math.floor((patch[x] + patch[x + 1] + patch[x + 2]) / 3);
				}
			}
			if (right) {
				for (let x = width - right; x < width; x++) {
					row[x] = grayArray[i - 1][1][currentYIndex][x];
				}
			}
			imgData[currentYIndex] = row;
		}
		if (bottom) {
			for (let y = height - bottom; y < height; y++) {
				imgData[y] = grayArray[i - 1][1][y];
			}
		}
		grayArray[i] = [delay, imgData];
	}
	for (let i = 0; i < grayArray.length; i++) {
		grayArray[i][1] = scale420(grayArray[i][1], width, height);
	}
	return grayArray;
}

// Nearest Neighbour Scaling 
// Port of http://tech-algorithm.com/articles/nearest-neighbor-image-scaling/
function scale420(data: number[][], currentWidth: number, currentHeight: number) {
	const output: number[][] = new Array(420);
	for (let i = 0; i < 420; i++) {
		output[i] = new Array(420);
	}
	const xRatio = currentWidth / 420;
	const yRatio = currentHeight / 420;
	for (let y = 0; y < 420; y++) {
		const currentY = Math.floor(y * yRatio);
		for (let x = 0; x < 420; x++) {
			const currentX = Math.floor(x * xRatio);
			output[y][x] = data[currentY][currentX];
		}
	}
	return output;
}

// export function trainingData() {
// 	const gifArray: number[][][] = [];
// 	readdirSync('./brain/training-data').forEach(gif => {
// 		const frames = decompressFrames(parseGIF(readFileSync(`./brain/training-data/${gif}`)), true);
// 		gifArray.push(getAllPixelData(frames));
// 	});
// 	return gifArray;
// }


// OLD 'getAllPixelData' IMPLEMENTATION - NEW IMPLEMENTATION RUNS NEARLY 2X FASTER!!!:

// const grayArray: number[][][] = [];
// for (let i = 0; i < frames.length; i++) {
// 	const patch = frames[i].patch;
// 	const imgData: number[][] = [];
// 	for (let y = 0; y < patch.length; y+=width * 4) {
// 		const row: number[] = [];
// 		for (let x = y, endX = x + (width * 4); x < endX; x+=4) {
// 			row.push(Math.floor((patch[x] + patch[x + 1] + patch[x + 2]) / 3));
// 		}
// 		imgData.push(row);
// 	}
// 	grayArray.push(imgData);
// }