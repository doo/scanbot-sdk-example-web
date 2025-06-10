import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DocumentScannerComponent } from './document-scanner/document-scanner.component';
import { BarcodeScannerComponent } from './barcode-scanner/barcode-scanner.component';
import { ImageResultsComponent } from './image-results/image-results.component';

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "document-scanner", component: DocumentScannerComponent },
  { path: "barcode-scanner", component: BarcodeScannerComponent },
  { path: "image-results", component: ImageResultsComponent },
];
