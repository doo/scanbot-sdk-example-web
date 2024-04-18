
import { useEffect } from 'react';

import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { QrCode, QrCode2 } from '@mui/icons-material';

import ScanbotSDK from 'scanbot-web-sdk/webpack/ui';
import { BarcodeScannerConfiguration } from 'scanbot-web-sdk/@types/ui2/configuration/BarcodeScannerConfiguration';
import { SingleScanningMode } from 'scanbot-web-sdk/@types/ui2/configuration/SingleScanningModeUseCase';
// import { BarcodeScannerConfiguration, SingleScanningMode } from 'scanbot-web-sdk/@types/ui2/configuration';

function App() {

	useEffect(() => {
		async function init() {
			console.log("Initializing Scanbot SDK");
			await ScanbotSDK.initialize({ licenseKey: '' });
		}
		init();
	}, []);

	return (
		<Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
			<List>
				<ListItem disablePadding>
					<ListItemButton onClick={async () => {
						// const config = new BarcodeScannerConfiguration();
						// const useCase = new SingleScanningMode();
						// config.useCase = useCase;
						//@ts-ignore
						const scanResult = await ScanbotSDK.UI.createBarcodeScanner({});
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
