import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private darkMode = new BehaviorSubject<boolean>(false);

  // Observable for the current dark mode state
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    // Initialize dark mode from local storage if present
    const savedMode = localStorage.getItem('darkMode');
    this.darkMode.next(savedMode === 'true');
  }

  toggleDarkMode() {
    const isDarkMode = !this.darkMode.value;
    this.darkMode.next(isDarkMode);
    // Save the preference
    localStorage.setItem('darkMode', isDarkMode.toString());
  }
}
