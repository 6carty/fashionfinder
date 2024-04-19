import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  constructor(private router: Router) {}

  gdpr(): void {
    this.router.navigate(['/gdpr']);
  }

  updateSCSSVariable(newSize: any, variableToUpdate: string) {
    document.documentElement.style.setProperty(variableToUpdate, newSize.toString());
  }

  ngOnInit(): void {
    const darkModeValue = localStorage.getItem('DarkMode');
    if (darkModeValue) {
      if (+darkModeValue == 0) {
        localStorage.setItem('false', 'darkMode');
        this.updateSCSSVariable('#202020', '--text-color');
      }
      if (+darkModeValue == 1) {
        localStorage.setItem('true', 'darkMode');
        this.updateSCSSVariable('#cccccc', '--text-color');
      }
    }

    const fontSizeValue = localStorage.getItem('--font-base-size');
    if (fontSizeValue) {
      this.updateSCSSVariable(fontSizeValue.toString(), '--font-base-value');
    }
  }
}
