import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, List } from '@mui/material';
import { ListAlt } from '@mui/icons-material';

import ScanbotSDK from 'scanbot-web-sdk/ui';


import FeatureListItem from './subviews/FeatureListItem';
import NavigationBar from './subviews/NavigationBar';
import type { UIConfig } from "scanbot-web-sdk/@types";
import { applyAcknowledgeScreenConfig } from "./config/AcknowledgeScreenConfig.ts";
import { applyIntroductionScreenConfig } from "./config/IntroductionScreenConfig.ts";
import { applyLocalizationConfig } from "./config/LocalizationConfig.ts";
import { applyScanningScreenConfig } from "./config/ScanningScreenConfig.ts";
import { applyPaletteConfig } from "./config/PaletteConfig.ts";
import { applyReviewScreenConfig } from "./config/ReviewScreenConfig.ts";
import { applyCroppingScreenConfig } from "./config/CroppingScreenConfig.ts";
import { applySinglePageScanningConfig } from "./config/SinglePageScanningConfig.ts";
import { applyMultiPageScanningConfig } from "./config/MultiPageScanningConfig.ts";
import { applySinglePageScanningWithFinderConfig } from "./config/SinglePageScanningWithFinderConfig.ts";
import { applyAutomaticFiltering } from "./config/AutomaticFilteringConfig.ts";

function App() {

    const navigate = useNavigate();
    const [sdkLoaded, setSdkLoaded] = useState(false);

    useEffect(() => {
        async function init() {
            await ScanbotSDK.initialize({
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
                licenseKey: "",
                /**
                 * We have designated a custom path for the wasm file in the public folder.
                 * This also means wasm binaries are copied from ScanbotSDK's node_modules to the wasm folder.
                 * Simply run 'npm run copy-wasm' to copy the wasm files to the public folder.
                 * cf the bash script in the package.json file.
                 */
                enginePath: "wasm"
            });
            setSdkLoaded(true);
        }
        init();
    }, []);

    const scenarios: { name: string, configModifier: (config: UIConfig.DocumentScanningFlow) => void }[] = [
        { name: "Default Config", configModifier: () => {} },
        { name: "Modified Acknowledge Screen Config", configModifier: applyAcknowledgeScreenConfig },
        { name: "Modified Introduction Screen Config", configModifier: applyIntroductionScreenConfig },
        { name: "Modified Localization Config", configModifier: applyLocalizationConfig },
        { name: "Modified Palette Config", configModifier: applyPaletteConfig },
        { name: "Modified Scanning Screen Config", configModifier: applyScanningScreenConfig },
        { name: "Modified Review Screen Config", configModifier: applyReviewScreenConfig },
        { name: "Modified Cropping Screen Config", configModifier: applyCroppingScreenConfig },
        { name: "Single-Page Scanning without review", configModifier: applySinglePageScanningConfig },
        { name: "Multi-Page Scanning with review", configModifier: applyMultiPageScanningConfig },
        { name: "Single-Page Scanning with Finder Overlay", configModifier: applySinglePageScanningWithFinderConfig },
        { name: "Automatic Filtering Config", configModifier: applyAutomaticFiltering },
    ];

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <NavigationBar />
            <List>
                {scenarios.map((scenario, index) =>
                    <FeatureListItem
                        key={index}
                        enabled={sdkLoaded}
                        text={scenario.name}
                        onClick={async () => {
                            const configuration = new ScanbotSDK.UI.Config.DocumentScanningFlow();
                            scenario.configModifier(configuration);
                            const result = await ScanbotSDK.UI.createDocumentScanner(configuration);
                            console.log('Scan result', result);
                            if (result?.document) {
                                await ScanbotSDK.instance.storage.insertSBDocument(result.document);
                            }
                        }}
                    />)
                }
                <Divider style={{ paddingTop: 10 }} />
                <FeatureListItem enabled={true} text="Saved Scan Results" icon={<ListAlt />} onClick={async () => {
                    navigate('scan-results');
                }} />
            </List>
        </Box>
    );
}

export default App;
