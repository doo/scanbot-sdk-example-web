import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import "./main.css"
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import DocumentResultPage from "./pages/DocumentResultPage.tsx";

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
