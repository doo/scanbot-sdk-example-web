import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HashRouter, Route, Routes } from 'react-router-dom'
import DocumentScannerPage from "./pages/DocumentScannerPage.tsx";
import VinScannerPage from "./pages/VinScannerPage.tsx";
import TextPatternScannerPage from "./pages/TextPatternScannerPage.tsx";
import MrzScannerPage from "./pages/MrzScannerPage.tsx";
import BarcodeScannerPage from "./pages/BarcodeScannerPage.tsx";
import StoredDataPage from "./pages/StoredDataPage.tsx";
import StoredDataDetailsPage from './pages/StoredDataDetailsPage.tsx';

createRoot(document.getElementById('root')!).render(
    <HashRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="barcode-scanner" element={<BarcodeScannerPage />} />
            <Route path="mrz-scanner" element={<MrzScannerPage />} />
            <Route path="text-pattern-scanner" element={<TextPatternScannerPage />} />
            <Route path="vin-scanner" element={<VinScannerPage />} />
            <Route path="document-scanner" element={<DocumentScannerPage />} />
            <Route path="stored-data" element={<StoredDataPage />} />
            <Route path="stored-data/details" element={<StoredDataDetailsPage />} />
        </Routes>
    </HashRouter>
)
