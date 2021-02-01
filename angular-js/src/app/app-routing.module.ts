import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {DocumentScannerComponent} from "./document-scanner/document-scanner.component";
import {ScanbotSDKService} from "./service/ScanbotSDKService";

export enum RoutePaths {
  Home = "home",
  DocumentScanner = "document-scanner"
}

const routes: Routes = [
  { path: '', redirectTo: RoutePaths.Home, pathMatch: 'full' },

  { path: RoutePaths.Home,            component: HomeComponent },
  { path: RoutePaths.DocumentScanner, component: DocumentScannerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ScanbotSDKService]
})
export class AppRoutingModule { }
