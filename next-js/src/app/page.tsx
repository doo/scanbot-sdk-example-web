"use client";

import { useEffect, useState } from "react";
import Header from "./subviews/header";
import ListItem from "./subviews/list-item";
import ScanbotSDKService from "./services/scanbot-sdk-service";

export default function Home() {

	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		async function loadSDK() {
			await ScanbotSDKService.instance.initialize();
			setIsLoading(false);
		}
		loadSDK();
	}, [isLoading])

	return (
		<div style={{ backgroundColor: "#f5f5f5", width: "100%", height: "100vh" }}>
			<Header />
			<ListItem
				isLoading={isLoading}
				href="/pages/document-scanner"
				title="Document Scanner"
				description="Scan any documents in front of you with auto-capture and user guidance."
			/>
			<ListItem
				isLoading={isLoading}
				href="/pages/barcode-scanner"
				title="Barcode Scanner"
				description="Scan any 1D or 2D barcode in front of you within the finder window."
			/>
			<ListItem
				isLoading={isLoading}
				href="/pages/document-list"
				title="Document List"
				description="View the documents you have scanned"
			/>
		</div>

	);
}
