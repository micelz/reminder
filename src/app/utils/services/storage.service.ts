import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { LoggingLevelType, ILog } from './logger.service';
import { ISetting } from './setting.service';

const Datastore = require('nedb');

const dbData = 'reminder-data.db';
const dbConfig = 'reminder-config.db';
const dbLog = 'reminder-log.db';

export type UUID = string;

export interface IFileInfo {
  id?: UUID;
  hash?: string;
  name?: string;
  path?: string;
  time?: any;
  installed?: boolean;
}

interface ICollection<T> {
  insert: (item: T) => Promise<T>;
  update: (item: T, nuevo: any) => Promise<T>;
  remove: (id: UUID) => Promise<T>;
  find: (obj: any) => Promise<T[]>;
  findAll: () => Promise<T[]>;
  removeAll: () => Promise<number>;
}

@Injectable()
export class StorageService {

    public items: ICollection<IFileInfo>;
    public settings: ICollection<ISetting>;
    public logs: ICollection<ILog>;

    private path: any;
    private remote: any;
    private rootPath;

    // ----------------------------------------------------------------------------------------------------------------
    // Constructor
    // ----------------------------------------------------------------------------------------------------------------

    constructor (private electronService: ElectronService) {
        const remote = this.electronService.remote;
        this.path = remote.require('path');
        this.rootPath = remote.app.getPath('userData');

        this.items = new Collection<IFileInfo>(this.getNewDatastore({filename: dbData, autoload: true}));
        this.settings = new Collection<ISetting>(this.getNewDatastore({filename: dbConfig, autoload: true}));
        this.logs = new Collection<ILog>(this.getNewDatastore({filename: dbLog, autoload: true}));
    }

    // ----------------------------------------------------------------------------------------------------------------
    // Public methods
    // ----------------------------------------------------------------------------------------------------------------

    getCollection<T>(name: string): ICollection<T> {
      return this[name];
    }

    // ----------------------------------------------------------------------------------------------------------------
    // Internals
    // ----------------------------------------------------------------------------------------------------------------

    private getNewDatastore(options: any): any {
      options.filename = this.getRootPath(options.filename);
      return new Datastore(options);
    }

    private getRootPath(name): string {
        return this.path.join(this.rootPath, name);
    }

}

class Collection<T> implements ICollection<T> {

  collection: any;

  // ----------------------------------------------------------------------------------------------------------------
  // Constructor
  // ----------------------------------------------------------------------------------------------------------------

  constructor(datastore: any) {
    this.collection = datastore;
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Public methods
  // ----------------------------------------------------------------------------------------------------------------

  insert(item: T): Promise<T> {
    return new Promise((resolve, reject) => {
        this.collection.insert(item, ((err: any, result: T) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }));
    });
  }

  update(id: any, updateObj: any): Promise<any> {
    return new Promise((resolve, reject) => {
        this.collection.update({_id: id}, { $set: updateObj }, ((err: any, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }));
    });
  }

  remove(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
        this.collection.remove({id: id}, ((err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
        }));
    });
  }

  removeAll(): Promise<number> {
    return new Promise((resolve, reject) => {
        this.collection.remove({}, {multi: true}, ((err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
        }));
    });
  }

  find(obj: any): Promise<T[]> {
    return new Promise((resolve, reject) => {
        this.collection.find(obj, ((err: any, result: T[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }));
    });
  }

  findAll(): Promise<T[]> {
    return new Promise((resolve, reject) => {
        return this.collection.find({}, ((err: any, result: T[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }));
    });
  }

}

