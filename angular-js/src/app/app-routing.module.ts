import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {DocumentScannerComponent} from "./document-scanner/document-scanner.component";
import {ScanbotSdkService} from "./service/scanbot-sdk-service";
import {DocumentRepository} from "./service/document-repository";
import {ImageResultsComponent} from "./image-results/image-results.component";
import {ImageDetailsComponent} from "./image-details/image-details.component";
import {CroppingComponent} from "./cropping/cropping.component";

export enum RoutePaths {
  Home            = "home",
  DocumentScanner = "document-scanner",
  ImageResults    = "image-results",
  ImageDetails    = "image-details",
  Cropping        = "cropping",
}

const routes: Routes = [
  { path: '', redirectTo: RoutePaths.Home, pathMatch: 'full' },

  { path: RoutePaths.Home,            component: HomeComponent },
  { path: RoutePaths.DocumentScanner, component: DocumentScannerComponent },
  { path: RoutePaths.ImageResults,    component: ImageResultsComponent },
  { path: RoutePaths.ImageDetails,    component: ImageDetailsComponent },
  { path: RoutePaths.Cropping,        component: CroppingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ScanbotSdkService, DocumentRepository]
})
export class AppRoutingModule { }
