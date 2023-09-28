
VERSION=3.0.0-rc.10

BASE_URL=https://cdn.jsdelivr.net/npm/scanbot-web-sdk@${VERSION}/bundle/
COMPLETE_WASM_BINARY_URL=${BASE_URL}bin/complete/
TESS_DATA_URL=${COMPLETE_WASM_BINARY_URL}tessdata/

mkdir -p wasm/tessdata

curl ${BASE_URL}ScanbotSDK.min.js -o wasm/ScanbotSDK.min.js

curl ${COMPLETE_WASM_BINARY_URL}ScanbotSDK.Asm.wasm -o wasm/ScanbotSDK.Asm.wasm
curl ${COMPLETE_WASM_BINARY_URL}ScanbotSDK.Core.js -o wasm/ScanbotSDK.Core.js

curl ${COMPLETE_WASM_BINARY_URL}ScanbotSDK.Asm-simd.wasm -o wasm/ScanbotSDK.Asm-simd.wasm
curl ${COMPLETE_WASM_BINARY_URL}ScanbotSDK.Core-simd.js -o wasm/ScanbotSDK.Core-simd.js

curl ${COMPLETE_WASM_BINARY_URL}tfjs-backend-wasm.wasm -o wasm/tfjs-backend-wasm.wasm
curl ${COMPLETE_WASM_BINARY_URL}tfjs-backend-wasm-simd.wasm -o wasm/tfjs-backend-wasm-simd.wasm
curl ${COMPLETE_WASM_BINARY_URL}tfjs-backend-wasm-threaded-simd.wasm -o wasm/tfjs-backend-wasm-threaded-simd.wasm

curl ${TESS_DATA_URL}deu.traineddata -o wasm/tessdata/deu.traineddata
curl ${TESS_DATA_URL}eng.traineddata -o wasm/tessdata/eng.traineddata