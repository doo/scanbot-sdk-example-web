import { useEffect, useState } from "react";
import ScanbotSDK from "scanbot-web-sdk/ui";
import toast, { Toaster } from 'react-hot-toast';
import { Launcher } from "./mrz/Launcher.ts";

function App() {

    const [sdk, setSdk] = useState<ScanbotSDK | null>(null);

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
                licenseKey: "",
                /**
                 * We have designated a custom path for the wasm file in the public folder.
                 * This also means wasm binaries are copied from ScanbotSDK's node_modules to the wasm folder.
                 * Simply run 'npm run copy-wasm' to copy the wasm files to the public folder.
                 * cf the bash script in the package.json file.
                 */
                enginePath: "wasm"
            });
            setSdk(sdk);
        }

        init();
    }, []);

    return (
        <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", width: "100vw" }}>
            <h2>RTU-UI Data Parsers</h2>
            <div style={{ width: "100%" }}>
                <div style={{ margin: 10, padding: 10, borderBottom: "1px solid gray", cursor: "pointer" }}
                     onClick={async () => {

                         const info = await sdk?.getLicenseInfo();
                         if (info === undefined) {
                             toast.error("License info missing. Are you sure you've initialized the SDK?");
                             return;
                         }
                         if (!info.isValid()) {
                             toast.error("License invalid. Status: " + info.status);
                             return;
                         }

                         const result = await Launcher.execute();
                         toast.success(result, { duration: 3000 });
                     }}>MRZ Scanner
                </div>
            </div>
            <Toaster />
        </div>
    );
}

export default App
