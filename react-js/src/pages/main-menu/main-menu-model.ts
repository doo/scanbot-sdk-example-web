import { ImageUtils } from "../../utils/image-utils";

function loadImage(filename: string) {
	return ImageUtils.loadImageFromAssets('menu/' + filename);
}

export const sectionContent = ({ ...args }: any) => {
	const {
		language,
		callDocument,
		callBarcode,
		viewDocuments,
		viewAcknowledgements,
		pageCount,
	} = args;

	return {
		documentScanner: {
			icon: loadImage('icon-documentScanner.svg'),
			title: language === 'de' ? 'DOKUMENTENSCANNER' : 'DOCUMENT SCANNERS',
			cards: [
				{
					image: loadImage('img-scanDocument.png'),
					title: language === 'de' ? 'Dokument scannen' : 'Scan documents',
					description:
						language === 'de'
							? 'Erfassen Sie rechteckige Dokumente, inklusive qualitätsverbessernder Funktionen'
							: 'Capture any rectangular document type, adjust with quality enhancing features',
					onclick: callDocument,
				},
				{
					image: loadImage('img-viewDocuments.png'),
					title: language === 'de' ? 'Dokumente ansehen' : 'View documents',
					description:
						language === 'de'
							? 'Überprüfung der gescannten Dokumente'
							: 'Review the scanned documents here',
					tooltip: pageCount,
					onclick: viewDocuments,
				},
			],
		},
		dataDetectors: {
			icon: loadImage('icon-dataDetectors.svg'),
			title: language === 'de' ? 'DATENERKENNUNG' : 'DATA DETECTORS',
			cards: [
				{
					image: loadImage('img-barcode.png'),
					title: language === 'de' ? 'Barcodes scannen ' : 'Scan barcodes',
					description:
						language === 'de'
							? 'Scannen und extrahieren Sie Barcodes '
							: 'Scan and extract various 1D and 2D barcodes',
					onclick: callBarcode,
				},
			],
		},
		about: {
			icon: loadImage('icon-warning.svg'),
			title: language === 'de' ? 'ÜBER UNS' : 'ABOUT',
			links: [
				{
					text:
						language === 'de'
							? 'Erfahren Sie mehr über das SDK'
							: 'Learn more about the SDK',
					onclick:
						language === 'de'
							? 'https://scanbot.io/de/sdk'
							: 'https://scanbot.io',
				},
			],
		},
		legal: {
			icon: loadImage('icon-warning.svg'),
			title: language === 'de' ? 'RECHTLICHE HINWEISE' : 'LEGAL INFORMATION',
			links: [
				{
					text: language === 'de' ? 'Nutzungsbedingungen' : 'Terms of use',
					onclick: 'https://scanbot.io/en/terms',
				},
				{
					text:
						language === 'de' ? 'Datenschutzbedingungen ' : 'Privacy policy',
					onclick:
						language === 'de'
							? 'https://scanbot.io/de/datenschutz'
							: 'https://scanbot.io/en/privacy',
				},
				{
					text: language === 'de' ? 'Impressum ' : 'Imprint',
					onclick:
						language === 'de'
							? 'https://scanbot.io/de/impressum'
							: 'https://scanbot.io/en/imprint',
				},
				{
					text: language === 'de' ? 'Danksagungen' : 'Acknowledgements',
					onclick: viewAcknowledgements,
				},
			],
		},
	};
};
