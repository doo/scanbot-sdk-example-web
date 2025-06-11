import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor() { }

  show(message: string, duration: number = 30000) {

    const toastContainer = document.createElement('div');
    toastContainer.classList.add('toast-container');
    document.body.appendChild(toastContainer);

    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, duration);
  }
}
