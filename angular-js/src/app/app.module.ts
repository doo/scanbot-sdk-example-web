import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DocumentScannerComponent } from './document-scanner/document-scanner.component';
import { ImageResultsComponent } from './image-results/image-results.component';
import {MatGridListModule} from "@angular/material/grid-list";
import { ImageDetailsComponent } from './image-details/image-details.component';
import { CroppingComponent } from './cropping/cropping.component';
import { BarcodeScannerComponent } from './barcode-scanner/barcode-scanner.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DocumentScannerComponent,
    ImageResultsComponent,
    ImageDetailsComponent,
    CroppingComponent,
    BarcodeScannerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
