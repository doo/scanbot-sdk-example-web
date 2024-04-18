
import { useEffect, useState } from 'react';

import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { QrCode, QrCode2 } from '@mui/icons-material';

import ScanbotSDK from 'scanbot-web-sdk/ui';
// import ScanbotSDK from 'scanbot-web-sdk';

import BarcodeFormat from 'scanbot-web-sdk/@types/model/barcode/BarcodeFormat';
// import { SingleScanningMode } from 'scanbot-web-sdk/@types/ui2/configuration/SingleScanningModeUseCase';
// import { BarcodeScannerConfiguration } from 'scanbot-web-sdk/@types/ui2/configuration/BarcodeScannerConfiguration';
// import { BarcodeScannerConfiguration, SingleScanningMode } from 'scanbot-web-sdk/@types/ui2/configuration';

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
				<ListItem disablePadding>
					<ListItemButton onClick={async () => {

						const config = new ScanbotSDK.UI.Config.BarcodeScannerConfiguration();
						const useCase = new ScanbotSDK.UI.Config.SingleScanningMode();
						config.useCase = useCase;

						const scanResult = await ScanbotSDK.UI.createBarcodeScanner(config);
						console.log("Result: ", scanResult);
					}}>
						<ListItemIcon>
							<QrCode />
						</ListItemIcon>
						<ListItemText primary="Single-Barcode Scanner" />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon>
							<QrCode2 />
						</ListItemIcon>
						<ListItemText primary="Multi-Barcode Scanner" />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	)
}

export default App
