import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { DocumentScannerComponent } from "./document-scanner/document-scanner.component";
import { ScanbotSdkService } from "./service/scanbot-sdk-service";
import { DocumentRepository } from "./service/document-repository";
import { ImageResultsComponent } from "./image-results/image-results.component";
import { ImageDetailsComponent } from "./image-details/image-details.component";
import { CroppingComponent } from "./cropping/cropping.component";
import { RoutePaths } from "./model/RoutePaths";
import { BarcodeScannerComponent } from "./barcode-scanner/barcode-scanner.component";
import { MrzScannerComponent } from "./mrz-scanner/mrz-scanner.component";
import { TextDataScannerComponent } from "./text-data-scanner/text-data-scanner.component";

const routes: Routes = [
  { path: "", redirectTo: RoutePaths.Home, pathMatch: "full" },

  { path: RoutePaths.Home, component: HomeComponent },
  { path: RoutePaths.DocumentScanner, component: DocumentScannerComponent },
  { path: RoutePaths.ImageResults, component: ImageResultsComponent },
  { path: RoutePaths.ImageDetails, component: ImageDetailsComponent },
  { path: RoutePaths.BarcodeScanner, component: BarcodeScannerComponent },
  { path: RoutePaths.MrzScanner, component: MrzScannerComponent },
  { path: RoutePaths.TextDataScanner, component: TextDataScannerComponent },
  { path: RoutePaths.Cropping, component: CroppingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ScanbotSdkService, DocumentRepository],
})
export class AppRoutingModule {}
