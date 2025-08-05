import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'

import './index.css'
import App from './App'
import DocumentScannerPage from "./pages/DocumentScannerPage";
import VinScannerPage from "./pages/VinScannerPage";
import TextPatternScannerPage from "./pages/TextPatternScannerPage";
import MrzScannerPage from "./pages/MrzScannerPage";
import BarcodeScannerPage from "./pages/BarcodeScannerPage";
import StoredDataPage from "./pages/StoredDataPage";
import StoredDataDetailsPage from './pages/StoredDataDetailsPage';
import CheckScannerPage from "./pages/CheckScannerPage.tsx";
import DocumentDataExtractorPage from "./pages/DocumentDataExtractorPage.tsx";

createRoot(document.getElementById('root')!).render(
    <HashRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="barcode-scanner" element={<BarcodeScannerPage />} />
            <Route path="check-scanner" element={<CheckScannerPage />} />
            <Route path="document-data-extractor" element={<DocumentDataExtractorPage />} />
            <Route path="mrz-scanner" element={<MrzScannerPage />} />
            <Route path="text-pattern-scanner" element={<TextPatternScannerPage />} />
            <Route path="vin-scanner" element={<VinScannerPage />} />
            <Route path="document-scanner" element={<DocumentScannerPage />} />
            <Route path="stored-data" element={<StoredDataPage />} />
            <Route path="stored-data/details" element={<StoredDataDetailsPage />} />
        </Routes>
    </HashRouter>
)
