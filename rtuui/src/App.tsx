
import { useEffect, useState } from 'react';
import { Box, List } from '@mui/material'
import { QrCode, QrCode2 } from '@mui/icons-material';

import ScanbotSDK from 'scanbot-web-sdk/ui';
import { MultipleScanningMode } from 'scanbot-web-sdk/@types/ui2/configuration';

import FeatureListItem from './subviews/FeatureListItem';

import { createMultipleScanningUseCaseConfig } from './config/MultipleScanningUseCaseConfig';
import { createBarcodeItemMapperConfig } from './config/BarcodeItemMapperConfig';
import startScanner from './launcher/StartScanner';

function App() {

	const [sdk, setSdk] = useState<ScanbotSDK | null>(null);

	useEffect(() => {
		async function init() {
			const sdk = await ScanbotSDK.initialize({ licenseKey: '' });
			console.log('Initialized with License:', await sdk.getLicenseInfo());
			setSdk(sdk);
		}
		init();
	}, []);

	return (
		<Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
			<List>
				<FeatureListItem text="Single-Barcode Scanner" icon={<QrCode />} onClick={async () => {
					const config = new ScanbotSDK.UI.Config.BarcodeScannerConfiguration();
					const result = await startScanner(config);
					console.log(result);
				}} />
				<FeatureListItem text="Multi-Barcode Scanner" icon={<QrCode2 />} onClick={async () => {
					const config = new ScanbotSDK.UI.Config.BarcodeScannerConfiguration();
					config.useCase = createMultipleScanningUseCaseConfig();
					(config.useCase as MultipleScanningMode).barcodeInfoMapping = createBarcodeItemMapperConfig();

					const result = await startScanner(config);
					console.log(result);
				}} />

			</List>
		</Box>
	)
}

export default App
