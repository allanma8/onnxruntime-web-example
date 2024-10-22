// Should work the same for both local and packages onnxruntimes.
// package.json for local:      "onnxruntime-web": "1.19.2"
// package.json for published   "onnxruntime-web": "file:./onnxruntime-web"
const ort = require('onnxruntime-web');

// Fix path of .wasm binaries.
// IMPORTANT: this (+ correct packaging) is what fixes web-workers in `onnxruntime-web`.
ort.env.wasm.wasmPaths = "../node_modules/onnxruntime-web/dist/"

// Use all available cores.
ort.env.wasm.numThreads = navigator.hardwareConcurrency;

async function main() {
    try {
        const session = await ort.InferenceSession.create("../public/yolov8n-pose.onnx");

        document.write("loaded model");

        const imageArray = new Float32Array(3 * 640 * 640);
        const imageTensor = new ort.Tensor('float32', imageArray, [1, 3, 640, 640]);

        document.write("running inference...");
        const start = performance.now();

        // Run 30 times to see how long it takes to infer a model.
        const runs = 30;

        for (let i = 0; i < runs; i++) {
            const input = { images: imageTensor };
            const results = await session.run(input);
        }

        const end = performance.now();

        const timeDifference = end - start;
        const timeAverage = timeDifference / runs;

        document.write(`inference took ${timeDifference.toFixed(2)}ms for ${runs} runs (average of ${timeAverage.toFixed(2)}ms)`);
    } catch (e) {
        document.write(`failed to inference ONNX model: ${e}.`);
    }
}

main();