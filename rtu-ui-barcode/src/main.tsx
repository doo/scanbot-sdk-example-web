import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import "./main.css"
import BarcodeResultPage from './pages/BarcodeResultPage'
import { HashRouter, Route, Routes } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<HashRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="scan-results" element={<BarcodeResultPage />} />
        </Routes>
      </HashRouter>
	</React.StrictMode>,
)
