
import { useEffect } from 'react';
import { Box, List } from '@mui/material'
import { QrCode, QrCode2, QrCodeScanner } from '@mui/icons-material';

import ScanbotSDK from 'scanbot-web-sdk/ui';

import startScanner from './launcher/StartScanner';
import { applyMultipleScanUseCase } from './config/MultipleScanUseCaseConfig';
import { applyBarcodeItemMapperConfig } from './config/BarcodeItemMapperConfig';
import { applySingleScanningUseCase } from './config/SingleScanUseCaseConfig';
import { applySheetMode } from './config/MultipleScanSheetConfig';
import { applyPaletteConfig } from './config/PaletteConfig';
import { applyActionBarConfig } from './config/ActionBarConfig';
import { applyAROverlayUseCaseConfig } from './config/AROverlayConfig';
import { applyTopBarConfig } from './config/TopBarConfig';
import { applyUserGuidanceConfig } from './config/UserGuidanceConfig';

import FeatureListItem from './subviews/FeatureListItem';
import NavigationBar from './subviews/NavigationBar';

function App() {

	useEffect(() => {
		async function init() {
			const sdk = await ScanbotSDK.initialize({
				/*
				* TODO add the license key here.
				* Please note: The Scanbot Web SDK will run without a license key for one minute per session!
				* After the trial period has expired, all SDK functions and UI components will stop working.
				* You can get a free "no-strings-attached" trial license.
				* Please submit the trial license form (https://scanbot.io/trial/) on our website using
				* "Web SDK" as the license type and a corresponding domain name of your test environment 
				* (e.g. myapp.example.com or www.mywebsite.com). Every trial license automatically 
				* includes "localhost" as a domain name for local development purposes.
				*/
				licenseKey: '',
				/**
				 * We have designated a custom path for the wasm file in the public folder.
				 * This also means wasm binaries are copied from ScanbotSDK's node_modules to the wasm folder.
				 * Simply run 'npm run copy-wasm' to copy the wasm files to the public folder.
				 * cf the bash script in the package.json file.
				 */
				engine: "wasm"
			});
			console.log('Initialized with License:', await sdk.getLicenseInfo());
		}
		init();
	}, []);

	return (
		<Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
			<NavigationBar />
			<List>
				<FeatureListItem text="Single-Barcode Scanner" icon={<QrCode />} onClick={async () => {
					const config = new ScanbotSDK.UI.Config.BarcodeScannerConfiguration();
					applySingleScanningUseCase(config);
					applyPaletteConfig(config);
					applyActionBarConfig(config);
					const result = await startScanner(config);
					console.log(result);
				}} />
				<FeatureListItem text="Multi-Barcode Scanner" icon={<QrCode2 />} onClick={async () => {
					const config = new ScanbotSDK.UI.Config.BarcodeScannerConfiguration();
					applyMultipleScanUseCase(config);
					applySheetMode(config);
					applyBarcodeItemMapperConfig(config);

					const result = await startScanner(config);
					console.log(result);
				}} />
				<FeatureListItem text="Multi-Scanner with AR Overlay" icon={<QrCodeScanner />} onClick={async () => {
					const config = new ScanbotSDK.UI.Config.BarcodeScannerConfiguration();
					applyTopBarConfig(config);
					applyUserGuidanceConfig(config);
					applyMultipleScanUseCase(config);
					applyAROverlayUseCaseConfig(config);

					const result = await startScanner(config);
					console.log(result);
				}} />
			</List>
		</Box>
	)
}

export default App
