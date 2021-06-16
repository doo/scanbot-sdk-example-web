
function loadImage(filename: string) {
    return require('../../assets/menu/' + filename)
}

export const sectionContent = ({...args}: any) => {
    const {language, callDocument, callBarcode, viewDocuments, pageCount} = args
    return {
        documentScanner: {
            icon: loadImage('icon-documentScanner.svg'),
            title: language === 'de' ? 'DOKUMENTENSCANNER' : 'DOCUMENT SCANNERS',
            cards: [
                {
                image: loadImage('img-scanDocument.png'),
                title: language === 'de' ? 'Dokument scannen' : 'Scan documents',
                description: language === 'de'
                    ? 'Erfassen Sie rechteckige Dokumente, inklusive qualitätsverbessernder Funktionen'
                    : 'Capture any rectangular document type, adjust with quality enhancing features',
                onclick: callDocument,
                },{
                image: loadImage('img-viewDocuments.png'),
                title: language === 'de' ? 'Dokumente ansehen' : 'View documents',
                description: language === 'de'
                    ? 'Überprüfung der gescannten Dokumente'
                    : 'Review the scanned documents here',
                tooltip: 1,
                onclick: viewDocuments,
                },
            ],
        },
        dataDetectors: {
            icon: loadImage('icon-dataDetectors.svg'),
            title: language === 'de' ? 'DATENERKENNUNG' : 'DATA DETECTORS',
            cards:[{
                image: loadImage('img-barcode.png'),
                title: language === 'de' ? 'QR- / Barcodes scannen ' : 'Scan QR- / barcodes',
                description: language === 'de'
                    ? 'Scannen und extrahieren Sie QR-/ Barcodes '
                    : 'Scan and extract various 1D- and 2D-barcodes',
                onclick: callBarcode,
            }]
        },
        about: {
            icon: loadImage('icon-warning.svg'),
            title: language === 'de' ? 'ÜBER UNS' : 'ABOUT',
            links: [{
                text: language === 'de' ? 'Erfahren Sie mehr über das SDK' : 'Learn more about the SDK',
                onclick: 'https://www.google.com'
            }]
        },
        legal: {
            icon: loadImage('icon-warning.svg'),
            title: language === 'de' ? 'RECHTLICHE HINWEISE' : 'LEGAL INFORMATION',
            links: [{
                text: language === 'de' ? 'Nutzungsbedingungen' : 'Terms of use',
                onclick: 'https://www.google.com'
            },{
                text: language === 'de' ? 'Datenschutzbedingungen ' : 'Privacy policy',
                onclick: 'https://www.google.com'
            },{
                text: language === 'de' ? 'Impressum ' : 'Imprint',
                onclick: 'https://www.google.com'
            },{
                text: language === 'de' ? 'Danksagungen' : 'Acknowledgements',
                onclick: 'https://www.google.com'
            }]
        }
    }
};