import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Location } from '@angular/common';
import { ScanbotService } from '../service/scanbot.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private location: Location) { }

  scanbotSDK = inject(ScanbotService);
  private router = inject(Router);

  onBackPress: () => void = () => {
    this.location.back();
  };

  async ngOnInit() {

    this.scanbotSDK.init().then(() => {
      console.log("Scanbot SDK initialization complete");
    });
    const backButton = document.querySelector('.back-button');
    this.router.events.subscribe(() => {
      if (this.router.url === '/') {
        backButton?.classList.add('hidden');
      } else {
        backButton?.classList.remove('hidden');
      }
    });
  }

}
