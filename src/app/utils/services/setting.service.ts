import { Injectable, EventEmitter } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { StorageService } from './storage.service';
import { LoggingLevelType } from './logger.service';

export interface ISetting {
  _id?: any;
  appName?: string;
  version?: string;
  description?: string;
  workingDirectory?: string;
  watchingFolder?: string;
  databaseFolder?: string;
  LoggingLevel?: LoggingLevelType;
  isNotificationActive?: boolean;
  isLoggingActive?: boolean;
}

@Injectable()
export class SettingService {

  private loadedSettings: ISetting[];
  private config: any;

  public changeSettings: EventEmitter<ISetting> = new EventEmitter<ISetting>();

  // ----------------------------------------------------------------------------------------------------------------
  // Constructor
  // ----------------------------------------------------------------------------------------------------------------

  constructor(private electronService: ElectronService,
              private storage: StorageService) {
    this.config = this.electronService.remote.require('./config.js');
    this.loadSettings();
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Properties
  // ----------------------------------------------------------------------------------------------------------------

  get info(): ISetting {
    return this.loadedSettings && this.loadedSettings[0];
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Public methods
  // ----------------------------------------------------------------------------------------------------------------

  async loadSettings(): Promise<ISetting[]> {
    this.loadedSettings = await this.storage.getCollection<ISetting>('settings').findAll();

    if (this.loadedSettings && this.loadedSettings.length > 0) {
      return this.loadedSettings;
    }

    this.loadedSettings = await this.setDefaults();
    return this.loadedSettings;
  }

  async save(setting: ISetting): Promise<ISetting[]> {
    if (setting._id) {
      console.log('update setting: ', setting._id);
      await this.storage.getCollection<ISetting>('settings').update(setting._id, setting);
    } else {
      console.log('add setting: ');
      await this.storage.getCollection<ISetting>('settings').insert(setting);
    }

    const settings = await this.loadSettings();
    this.changeSettings.emit(settings[0]);

    return settings;
  }

  async removeAll(): Promise<number> {
    const count = await this.storage.getCollection<ISetting>('settings').removeAll();
    return count;
  }

  async resetFactorySettings(): Promise<void> {
    const count = await this.removeAll();
    console.log('count: ', count);
    await this.setDefaults();
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Internals
  // ----------------------------------------------------------------------------------------------------------------

  private async setDefaults(): Promise<ISetting[]> {
    const defaults = {
      appName: this.config.name,
      version: this.config.version,
      description: this.config.description || '',
      workingDirectory: this.config.workingDirectory,
      watchingFolder: this.config.watchingFolder || this.config.workingDirectory + '/test',
      // databaseFolder: this.electronService.remote.app.getPath('userData'),
      LoggingLevel: this.config.LoggingLevel || 'info',
      isNotificationActive: this.config.isNotificationActive || true,
      isLoggingActive: this.config.isLoggingActive || false,
    };
    return await this.save(defaults);
  }

}

