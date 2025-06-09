import { Routes } from '@angular/router';
import { DocumentScannerComponent } from './document-scanner/document-scanner.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "document-scanner", component: DocumentScannerComponent }
];
