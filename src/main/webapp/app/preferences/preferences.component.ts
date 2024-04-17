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
    this.darkModeService.toggleDarkMode();
  }
  ngOnInit(): void {
    if (localStorage.getItem('--font-base-size') == null) {
      localStorage.setItem('--font-base-size', this.value.toString());
    } else {
      var tempvalue = localStorage.getItem('--font-base-size');
      if (tempvalue) this.value = +tempvalue;
    }
  }

  updateFontBaseSize(newSize: number) {
    document.documentElement.style.setProperty('--font-base-size', newSize.toString());
  }

  increaseFontSize() {
    var value = localStorage.getItem('--font-base-size');

    if (value && +value < 1.3) {
      this.updateFontBaseSize(+value + 0.1);
      localStorage.setItem('--font-base-size', (+value + 0.1).toString());
    }
  }

  decreaseFontSize() {
    var value = localStorage.getItem('--font-base-size');

    if (value && +value > 0.7) {
      this.updateFontBaseSize(+value - 0.1);
      localStorage.setItem('--font-base-size', (+value - 0.1).toString());
    }
  }
}
