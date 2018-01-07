import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { FileService } from './file.service';
import { LoggerService } from './logger.service';

@Injectable()
export class CryptoService {

  private md5: any;

  constructor(private electronService: ElectronService,
              private fileService: FileService,
              private logger: LoggerService) {
    const remote = this.electronService.remote;
    this.md5 = remote.require('md5');
  }

  async createHash(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
          const readFile = this.fileService.readFile();
          readFile(path, (err, data) => {
          if (err) {
            reject(err);
          }
          return resolve(this.md5(data + path));
          });
      } catch (e) {
        this.logger.error('Error occurs while creating file hash. ', e);
        reject(e);
      }
    });
  }

}
