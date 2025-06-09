import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ScanbotService } from '../service/scanbot.service';
import { HomeComponent } from './home/home.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private location: Location) { }

  // scanbotSDK = inject(ScanbotService);
  private router = inject(Router);
  //
  //
  // constructor() {
  //   // Initialize the Scanbot SDK
  //   this.scanbotSDK.init().then(() => {
  //     console.log('Scanbot SDK initialized successfully');
  //
  //     this.router.navigate(['/document-scanner']).then(() => {
  //       console.log('Navigation to Document Scanner successful');
  //     });
  //   }).catch(error => {
  //     console.error('Error initializing Scanbot SDK:', error);
  //   });
  // }
  onBackPress: () => void = () => {
    // Handle back button press
    console.log('Back button pressed');
    this.location.back();
  };
  ngOnInit() {
    // access back-button element
    const backButton = document.querySelector('.back-button');
    // Hide back button when router location is at root, otherwise show and use it to navigate back
    this.router.events.subscribe(() => {
      if (this.router.url === '/') {
        // Hide back button
        console.log('At root, hiding back button');
        if (backButton) {
          backButton.classList.add('hidden');
        }
      } else {
        // Show back button
        console.log('Not at root, showing back button');
        if (backButton) {
          backButton.classList.remove('hidden');
        }
      }
    });
  }

}
