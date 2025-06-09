import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ScanbotService } from '../service/scanbot.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  scanbotSDK = inject(ScanbotService);
  private router = inject(Router);


  constructor() {
    // Initialize the Scanbot SDK
    this.scanbotSDK.init().then(() => {
      console.log('Scanbot SDK initialized successfully');

      this.router.navigate(['/document-scanner']).then(() => {
        console.log('Navigation to Document Scanner successful');
      });
    }).catch(error => {
      console.error('Error initializing Scanbot SDK:', error);
    });
  }


}
