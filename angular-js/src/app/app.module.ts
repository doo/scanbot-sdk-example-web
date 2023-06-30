import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { DocumentScannerComponent } from "./document-scanner/document-scanner.component";
import { ImageResultsComponent } from "./image-results/image-results.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { ImageDetailsComponent } from "./image-details/image-details.component";
import { CroppingComponent } from "./cropping/cropping.component";
import { BarcodeScannerComponent } from "./barcode-scanner/barcode-scanner.component";
import { ToastrModule } from "ngx-toastr";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MrzScannerComponent } from "./mrz-scanner/mrz-scanner.component";
import { TextDataScannerComponent } from "./text-data-scanner/text-data-scanner.component";
import { ToolbarComponent } from "./common/components/toolbar/toolbar.component";
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DocumentScannerComponent,
    ImageResultsComponent,
    ImageDetailsComponent,
    CroppingComponent,
    BarcodeScannerComponent,
    MrzScannerComponent,
    TextDataScannerComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatGridListModule,
    CommonModule,
    BrowserAnimationsModule,
    MatIconModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
