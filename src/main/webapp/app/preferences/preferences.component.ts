import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'app/shared/dark-mode.service';

@Component({
  selector: 'jhi-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
})
export class PreferencesComponent implements OnInit {
  constructor(private darkModeService: DarkModeService) {}

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }
  ngOnInit(): void {}
}
