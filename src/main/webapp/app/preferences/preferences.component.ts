import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'app/shared/dark-mode.service';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'jhi-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
})
export class PreferencesComponent implements OnInit {
  constructor(private darkModeService: DarkModeService, private renderer: Renderer2) {}

  value: number = 1;

  toggleDarkMode(): void {
    const darkModeValue = localStorage.getItem('DarkMode');
    this.darkModeService.toggleDarkMode();
    if (darkModeValue) {
      if (+darkModeValue == 0) {
        localStorage.setItem('DarkMode', '1');
        this.updateSCSSVariable('#cccccc', '--text-color');
      }
      if (+darkModeValue == 1) {
        localStorage.setItem('DarkMode', '0');
        this.updateSCSSVariable('#202020', '--text-color');
      }
    }
  }
  ngOnInit(): void {
    if (localStorage.getItem('DarkMode') == null) {
      localStorage.setItem('DarkMode', '0');
    }
    if (localStorage.getItem('--font-base-size') == null) {
      localStorage.setItem('--font-base-size', this.value.toString());
    } else {
      var tempvalue = localStorage.getItem('--font-base-size');
      if (tempvalue) this.value = +tempvalue;
    }
  }

  updateSCSSVariable(newSize: any, variableToUpdate: string) {
    document.documentElement.style.setProperty(variableToUpdate, newSize.toString());
  }

  increaseFontSize() {
    var value = localStorage.getItem('--font-base-size');

    if (value && +value < 1.3) {
      this.updateSCSSVariable(+value + 0.1, '--font-base-size');
      localStorage.setItem('--font-base-size', (+value + 0.1).toString());
    }
  }

  decreaseFontSize() {
    var value = localStorage.getItem('--font-base-size');

    if (value && +value > 0.7) {
      this.updateSCSSVariable(+value - 0.1, '--font-base-size');
      localStorage.setItem('--font-base-size', (+value - 0.1).toString());
    }
  }
}
