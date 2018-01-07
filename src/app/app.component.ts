import { Component, OnInit } from '@angular/core';

import { ISetting } from './utils/services/setting.service';
import { SettingService } from './utils/services/setting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

  public title;
  public isLoggingActive = false;

  constructor(private settings: SettingService) {}

  ngOnInit() {
    this.loadVersion();
    this.settings.changeSettings.subscribe((s: ISetting) => this.isLoggingActive = s.isLoggingActive);
  }

  async loadVersion(): Promise<void> {
    const setting: ISetting[] = await this.settings.loadSettings();
    this.isLoggingActive = setting && setting[0].isLoggingActive || false;
    this.title = (setting && setting[0].appName || 'reminder').toUpperCase();
  }

}
