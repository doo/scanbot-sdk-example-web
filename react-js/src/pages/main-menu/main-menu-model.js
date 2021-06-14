export const sectionContent = lang => {
    return {
        documentScanner: {
            icon: require('../../assets/menu/icon-documentScanner.svg'),
            title: lang === 'de' ? 'DOKUMENTENSCANNER' : 'DOCUMENT SCANNERS'
        },
        dataDetectors: {
            icon: require('../../assets/menu/icon-dataDetectors.svg'),
            title: lang === 'de' ? 'DATENERKENNUNG' : 'DATA DETECTORS'
        },
        about: {
            icon: require('../../assets/menu/icon-warning.svg'),
            title: lang === 'de' ? 'ÜBER UNS' : 'ABOUT'
        },
        legal: {
            icon: require('../../assets/menu/icon-warning.svg'),
            title: lang === 'de' ? 'RECHTLICHE HINWEISE' : 'LEGAL INFORMATION'
        }
    }
}

export const cardContent = lang => {
    return {
        scanDocuments: {
            image: require('../../assets/menu/img-scanDocument.png'),
            title: lang === 'de' ? 'Dokument scannen' : 'Scan documents',
            description: lang === 'de'
                ? 'Erfassen Sie rechteckige Dokumente, inklusive qualitätsverbessernder Funktionen'
                : 'Capture any rectangular document type, adjust with quality enhancing features',
        },
        viewDocuments: {
            image: require('../../assets/menu/img-viewDocuments.jpg'),
            title: lang === 'de' ? 'Dokumente ansehen' : 'View documents',
            description: lang === 'de'
                ? 'Überprüfung der gescannten Dokumente'
                : 'Review the scanned documents here',
        },
        barcode: {
            image: require('../../assets/menu/img-barcode.png'),
            title: lang === 'de' ? 'QR- / Barcodes scannen ' : 'Scan QR- / barcodes',
            description: lang === 'de'
                ? 'Scannen und extrahieren Sie QR-/ Barcodes '
                : 'Scan and extract various 1D- and 2D-barcodes',
        },
    }
}

export const linkContent = lang => {
    return {
        learnMore: {
            text: lang === 'de' ? 'Erfahren Sie mehr über das SDK' : 'Learn more about the SDK',
            onclick: 'https://www.google.com'
        },
        terms: {
            text: lang === 'de' ? 'Nutzungsbedingungen' : 'Terms of use',
            onclick: 'https://www.google.com'
        },
        privacy: {
            text: lang === 'de' ? 'Datenschutzbedingungen ' : 'Privacy policy',
            onclick: 'https://www.google.com'
        },
        imprint: {
            text: lang === 'de' ? 'Impressum ' : 'Imprint',
            onclick: 'https://www.google.com'
        },
        acknowledgements: {
            text: lang === 'de' ? 'Danksagungen' : 'Acknowledgements',
            onclick: 'https://www.google.com'
        },
    }
}