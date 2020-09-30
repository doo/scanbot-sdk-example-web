import React from 'react';
import './App.css';

import ScanbotSDK from "scanbot-web-sdk/webpack";
import {DocumentScannerConfiguration} from "scanbot-web-sdk/component/model/document-scanner-configuration";
import {AppBar, Container, Toolbar, Typography} from "@material-ui/core";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

export default class App extends React.Component<any, any> {

    SCANNER_CONTAINER = "document-scanner-view";
    license = "";
    SDK: ScanbotSDK | undefined;

    document: any;

    constructor(props: any) {
        super(props);
        this.state = { isOpen: false };
    }

    async componentDidMount() {
        this.SDK = await ScanbotSDK.initialize({
            licenseKey: this.license,
            engine: "/"
        });

        if (!this.SDK.initialized) {
            const info = await this.SDK.getLicenseInfo();
            console.log("Something went wrong. Here's your license info:", info);
            return;
        }

        const configuration: DocumentScannerConfiguration = {
            onDocumentDetected: async (result: any) => {
                console.log("Detected document:", result);
                this.document = result;
                this.setState({ isOpen: true });
            },
            containerId: this.SCANNER_CONTAINER
        };

        await this.SDK.createDocumentScanner(configuration);
    }

    render() {
        return (
            <div className="App">
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h6" >
                            Scanbot Web SDK Example
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container style={{height: "100vh"}}>
                    <div id={this.SCANNER_CONTAINER} style={{width: "100%", height: "100%"}}/>
                </Container>

                {this.state.isOpen && (
                    <Lightbox
                        mainSrc={this.document.cropped ? this.document.cropped : this.document.original}
                        onCloseRequest={() => this.setState({ isOpen: false })}

                    />)}
            </div>
        );
    }
}
