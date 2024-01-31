"use client";

import { useEffect } from "react";
import Header from "./subviews/header";
import ListItem from "./subviews/list-item";
import ScanbotSDKService from "./services/scanbot-sdk-service";

export default function Home() {

	useEffect(() => {
		ScanbotSDKService.instance.initialize();
	  }, [])
	
	return (
		<div style={{ backgroundColor: "#f5f5f5", width: "100%", height: "100vh" }}>
			<Header />
			<ListItem
				href="/document-scanner"
				title="Document Scanner"
				description="Scan any documents in front of you with auto-capture and user guidance."
			/>
			<ListItem
				href="/barcode-scanner"
				title="Barcode Scanner"
				description="Scan any 1D or 2D barcode in front of you within the finder window."
			/>
		</div>

	);
}
