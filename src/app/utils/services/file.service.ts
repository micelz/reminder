import { Injectable, EventEmitter } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { SettingService } from './setting.service';
import { LoggerService } from './logger.service';

export class FileEvent {
    name: string;
    path: string;
    event: string;
}

@Injectable()
export class FileService {

  private watcher: any;
  private chokidar: any;
  private fs: any;

  public changeEvent: EventEmitter<FileEvent> = new EventEmitter<FileEvent>();

  // ----------------------------------------------------------------------------------------------------------------
  // Public methods
  // ----------------------------------------------------------------------------------------------------------------

  constructor(private electronService: ElectronService,
              private logger: LoggerService,
              private setting: SettingService) {
    const remote = this.electronService.remote;
    this.chokidar = remote.require('chokidar');
    this.fs = remote.require('fs');
    this.register();
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Public methods
  // ----------------------------------------------------------------------------------------------------------------

  reset(): Promise<any> {
    this.deregister();
    return this.register();
  }

  getDirectoryStats(directory: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.fs.stat(directory, function(err, stats) {
          if (err) {
            reject(err);
          }
          resolve(stats);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  readFile(): any {
    return this.fs.readFile;
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Events
  // ----------------------------------------------------------------------------------------------------------------

  register(): Promise<any> {
    return this.setting.loadSettings().then(result => {
      this.logger.info('Register all action listener:', result);
      this.watcher = this.chokidar.watch(result[0].watchingFolder, {
        ignored: /[\/\\]\./, persistent: true
      });

      this.watcher.on('add', this.onAdd.bind(this));
      this.watcher.on('change', this.onChange.bind(this));
      this.watcher.on('unlink', this.onUnLink.bind(this));
    });
  }

  deregister(): any {
    if (this.watcher) {
      this.watcher.close();
    }
  }

  onAdd(event): any {
    const {fileName, filePath} = this.parseFileInfo(event);
    this.changeEvent.emit({name: fileName, path: filePath, event: 'add'});
  }

  onChange(event): any {
    const {fileName, filePath} = this.parseFileInfo(event);
    this.changeEvent.emit({name: fileName, path: filePath, event: 'change'});
  }

  onUnLink(event): any {
    const {fileName, filePath} = this.parseFileInfo(event);
    this.changeEvent.emit({name: fileName, path: filePath, event: 'unlink'});
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Internals
  // ----------------------------------------------------------------------------------------------------------------

  private parseFileInfo(event): any {
      return {filePath: event, fileName: event.replace(/^.*[\\\/]/, '')};
  }

}

