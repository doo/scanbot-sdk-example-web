import { Box, List } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { Code, DirectionsCar, DocumentScanner, QrCodeScanner, TextIncrease } from "@mui/icons-material";
import ScanbotSDK from "scanbot-web-sdk/ui";

import FeatureListItem from "./subviews/FeatureListItem.tsx";
import SectionHeader from "./subviews/SectionHeader.tsx";
import { TopBar } from "./subviews/TopBar.tsx";
import { useEffect } from "react";
import SBSDKService from "./service/SBSDKService.tsx";

function App() {

    const navigate = useNavigate();

    useEffect(() => {
        SBSDKService.initialize();
    }, []);

    return (
        <Box style={{ width: "100vw", height: "100vh", backgroundColor: "white" }}>
            <TopBar title={"Scanbot Web SDK"} />
            <List sx={{}}>

                <SectionHeader title={"Classic Scanners"} />
                <FeatureListItem icon={DocumentScanner} text='Document Scanner View' onClick={() => {
                    navigate('document-scanner');
                }} />
                <FeatureListItem icon={QrCodeScanner} text='Barcode Scanner View' onClick={() => {
                    navigate('barcode-scanner');
                }} />
                <FeatureListItem icon={Code} text='MRZ Scanner View' onClick={() => {
                    navigate('mrz-scanner');
                }} />
                <FeatureListItem icon={TextIncrease} text='Text Pattern Scanner View' onClick={() => {
                    navigate('text-pattern-scanner');
                }} />
                <FeatureListItem icon={DirectionsCar} text='VIN Scanner View' onClick={() => {
                    navigate('vin-scanner');
                }} />

                <SectionHeader title={"Ready-To-Use Components"} paddingTop={10} />
                <FeatureListItem icon={DocumentScanner} text='Document Scanner UI' onClick={async () => {
                    // Configure your document scanner as needed
                    const config = new ScanbotSDK.UI.Config.DocumentScanningFlow();
                    config.screens.camera.backgroundColor = '#FF0000';
                    const result = await ScanbotSDK.UI.createDocumentScanner(config);
                    console.log('Scan result', result);
                }} />
                <FeatureListItem icon={QrCodeScanner} text='Barcode Scanner UI' onClick={async () => {
                    // Configure your barcode scanner as needed
                    const config = new ScanbotSDK.UI.Config.BarcodeScannerConfiguration();
                    config.useCase = new ScanbotSDK.UI.Config.SingleScanningMode();
                    const result = await ScanbotSDK.UI.createBarcodeScanner(config);
                    console.log('Barcode result', result);
                }} />
            </List>
        </Box>
    )
}

export default App
