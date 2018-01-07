import { Component, OnInit, NgModule } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { SettingService, ISetting } from '../utils/services/setting.service';
import { FileService } from '../utils/services/file.service';
import { LoggerService } from '../utils/services/logger.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  public setting: ISetting = {};
  public errorMessage = '';
  public downloadStatus: any;

  private dialog: any;
  private autoUpdater: any;

  // ----------------------------------------------------------------------------------------------------------------
  // Constructor
  // ----------------------------------------------------------------------------------------------------------------

  constructor(private logger: LoggerService,
              private settings: SettingService,
              private fileService: FileService,
              private electronService: ElectronService) {
                const remote = electronService.remote;
    this.dialog = remote.dialog;
    this.autoUpdater = remote.require('electron-updater').autoUpdater;

    this.settings.changeSettings.subscribe(() => this.load());

    this.autoUpdater.on('checking-for-update', this.onUpdateCheckFor.bind(this));
    this.autoUpdater.on('update-available', this.onUpdateAvailable.bind(this));
    this.autoUpdater.on('update-not-available', this.onUpdateNotAvailable.bind(this));
    this.autoUpdater.on('download-progress', this.onDownloadProgress.bind(this));
    this.autoUpdater.on('update-downloaded', this.onUpdateDownloaded.bind(this));
    this.autoUpdater.on('error', this.onUpdateError.bind(this));
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Lifecycle hooks
  // ----------------------------------------------------------------------------------------------------------------

  ngOnInit() {
    this.load();
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Public methods
  // ----------------------------------------------------------------------------------------------------------------

  async save(): Promise<void> {
    this.settings.save(this.setting);
    this.logger.debug('Set and save setting to database');
  }

  browse(prop: string): any {
    this.dialog.showOpenDialog({title: 'Select a folder', properties: ['openDirectory']}, (folderPath) => {
      if (folderPath === undefined) {
        this.errorMessage = 'Error: Folder could not be found.';
        return;
      }
      this.setting[prop] = folderPath;
    });
  }

  resetFactorySettings(): void {
    this.settings.resetFactorySettings();
  }

  checkForUpdates(): any {
    // this.autoUpdater.checkForUpdates();
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Internals
  // ----------------------------------------------------------------------------------------------------------------

  private async load(): Promise<void> {
    const loadedSettings = await this.settings.loadSettings();
    this.setting = loadedSettings && loadedSettings[0];
  }

  onUpdateCheckFor(): any {
    console.log('Checking for updates');
  }

  onUpdateAvailable(info: any): any {
    console.log('Update available...', info.version);
  }

  onUpdateNotAvailable(): any {
    console.log('Update not available...');
  }

  onDownloadProgress(progress: any): any {
    this.downloadStatus = Math.floor(progress.percent);
    console.log(`Download update. Progress: ${Math.floor(progress.percent)}`);
  }

  onUpdateDownloaded(): any {
    console.log('Update downloaded');
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? 'releaseNotes' : 'releaseName',
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    };

    this.dialog.showMessageBox(dialogOpts, (response) => {
      if (response === 0) {
        this.autoUpdater.quitAndInstall();
      }
    });
  }

  onUpdateError(error: any): any {
    console.error('There was a problem updating the application');
    console.error(error);
  }

}
