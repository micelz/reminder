import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { SettingService } from './setting.service';

export interface INotification {
  title: string;
  body: string;
  icon?: string;
}

@Injectable()
export class NotificationService {

  private ipcRenderer: any;

  // ----------------------------------------------------------------------------------------------------------------
  // Constructor
  // ----------------------------------------------------------------------------------------------------------------

  constructor(private electronService: ElectronService,
              private settings: SettingService) {
    this.ipcRenderer = electronService.ipcRenderer;
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Public methods
  // ----------------------------------------------------------------------------------------------------------------

  async createNotification(notify: INotification): Promise<void> {
    if (!await this.canSendNotification()) {
      return;
    }
    this.ipcRenderer.send('notification', {
      title: notify.title || 'Upps, ...',
      body: notify.body || 'Sorry, no message was defined.'
    });
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Internals
  // ----------------------------------------------------------------------------------------------------------------

  private async canSendNotification(): Promise<boolean> {
    const settings = await this.settings.loadSettings();
    return settings[0].isNotificationActive || false;
  }

}
