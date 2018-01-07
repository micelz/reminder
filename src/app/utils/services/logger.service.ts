import { Injectable } from '@angular/core';

import { SettingService } from './setting.service';
import { StorageService } from './storage.service';

export type LoggingLevelType = 'info' | 'debug' | 'error';

export interface ILog {
  id?: string;
  messageShort?: string;
  messageLong?: string;
  time?: number;
  type?: string;
}

@Injectable()
export class LoggerService {

  // ----------------------------------------------------------------------------------------------------------------
  // Constructor
  // ----------------------------------------------------------------------------------------------------------------

  constructor(private settings: SettingService,
              private storage: StorageService) {
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Public methods
  // ----------------------------------------------------------------------------------------------------------------

  async info(message: string, ...arg): Promise<void> {
    const {level, isActive} = await this.loadLogSettings();
    if (level === 'info' && isActive) {
      this.log(level, message, arg);
    }
  }

  async debug(message, ...arg): Promise<void> {
    const {level, isActive} = await this.loadLogSettings();
    if (level === 'debug' && isActive) {
      this.log(level, message, arg);
    }
  }

  async error(message, ...arg): Promise<void> {
    const {level, isActive} = await this.loadLogSettings();
    if (level === 'error' && isActive) {
      this.log(level, message, arg);
    }
  }

  async removeAll(): Promise<number> {
    const count = await this.storage.getCollection<ILog>('logs').removeAll();
    return count;
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Internals
  // ----------------------------------------------------------------------------------------------------------------

  private log(type: LoggingLevelType, message: string, ...arg): void {
    const time = Date.now();
    console.log(`LOG: [${this.getTypeName(type)}] ${time}: ${message}`, arg[0]);
    this.writeToDatabase({
      type: this.getTypeName(type),
      messageShort: message || 'UNDEFINED',
      messageLong: arg[0] || 'UNDEFINED',
      time
    });
  }

  private getTypeName(type: LoggingLevelType): string {
    switch (type) {
      case 'info': return 'INFO';
      case 'debug': return 'DEBUG';
      case 'error': return 'ERROR';
      default: return 'UNDEFINED';
    }
  }

  private async writeToDatabase(logging: ILog): Promise<void> {
    await this.storage.getCollection<ILog>('logs').insert(logging);
  }

  private async loadLogSettings(): Promise<any> {
    const result = await this.settings.loadSettings();
    return {
      level: result[0].LoggingLevel || 'info',
      isActive: result[0].isLoggingActive || false
    };
  }

}
