
import { useEffect, useState } from 'react';
import { Box, List } from '@mui/material'
import { QrCode, QrCode2 } from '@mui/icons-material';

import ScanbotSDK from 'scanbot-web-sdk/ui';
import { MultipleScanningMode } from 'scanbot-web-sdk/@types/ui2/configuration';

import FeatureListItem from './subviews/FeatureListItem';

import { createMultipleScanningUseCaseConfig } from './config/MultipleScanningUseCaseConfig';
import { createBarcodeItemMapperConfig } from './config/BarcodeItemMapperConfig';

function App() {

	const [sdk, setSdk] = useState<ScanbotSDK | null>(null);

	useEffect(() => {
		async function init() {
			console.log("Initializing Scanbot SDK");
			const sdk = await ScanbotSDK.initialize({ licenseKey: '' });
			setSdk(sdk);
		}
		init();
	}, []);

	return (
		<Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
			<List>
				<FeatureListItem text="Single-Barcode Scanner" icon={<QrCode />} onClick={async () => {
					const scanner = await sdk?.createBarcodeScanner({ containerId: "classic-scanner-container" });
				}} />
				<FeatureListItem text="Multi-Barcode Scanner" icon={<QrCode2 />} onClick={async () => {
					const config = new ScanbotSDK.UI.Config.BarcodeScannerConfiguration();
					config.useCase = createMultipleScanningUseCaseConfig();
					(config.useCase as MultipleScanningMode).barcodeInfoMapping = createBarcodeItemMapperConfig();

					const scanResult = await ScanbotSDK.UI.createBarcodeScanner(config);
					console.log("Result: ", scanResult);
				}} />

			</List>
			<div id="classic-scanner-container" style={{ width: 100, height: 100, bottom: 5 }}></div>
		</Box>
	)
}

export default App
