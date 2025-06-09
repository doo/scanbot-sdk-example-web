import { Component, inject } from '@angular/core';
import { ScanbotService } from '../../service/scanbot.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  scanbotSDK = inject(ScanbotService);
  private router = inject(Router);


  constructor() {
    // Initialize the Scanbot SDK
    this.scanbotSDK.init().then(() => {
      console.log('Scanbot SDK initialized successfully');

      //   this.router.navigate(['/document-scanner']).then(() => {
      //     console.log('Navigation to Document Scanner successful');
      //   });
      // }).catch(error => {
      //   console.error('Error initializing Scanbot SDK:', error);
    });
  }

}
