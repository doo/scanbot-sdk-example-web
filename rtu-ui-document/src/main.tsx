import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ReactDOM from 'react-dom/client'

import App from './App'
import "./main.css"
import DocumentResultPage from "./pages/DocumentResultPage";

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<MemoryRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="scan-results" element={<DocumentResultPage />} />
        </Routes>
      </MemoryRouter>
	</React.StrictMode>,
)
