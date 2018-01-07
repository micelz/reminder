import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UUID } from 'angular2-uuid';
import { MomentModule } from 'angular2-moment';

import { CryptoService } from '../utils/services/crypto.service';
import { FileService, FileEvent } from '../utils/services/file.service';
import { ListDataSource } from '../utils/list-data-source';
import { LoggerService } from '../utils/services/logger.service';
import { List, IList } from '../utils/list';
import { NotificationService, INotification } from '../utils/services/notification.service';
import { StorageService, IFileInfo } from '../utils/services/storage.service';

import * as _ from 'underscore';

@Component({
  selector: 'app-info',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {

  public dataSourcePending: ListDataSource<IFileInfo>;
  public dataSourceApproved: ListDataSource<IFileInfo>;

  private itemsPending = new List<IFileInfo>();
  private itemsApproved = new List<IFileInfo>();
  private promise: Promise<IFileInfo[]> = null;

  // ----------------------------------------------------------------------------------------------------------------
  // Constructor
  // ----------------------------------------------------------------------------------------------------------------

  constructor(private crypto: CryptoService,
              private logger: LoggerService,
              private storage: StorageService,
              private watcher: FileService,
              private notification: NotificationService,
              public zone: NgZone) {}

  // ----------------------------------------------------------------------------------------------------------------
  // Lifecycle hooks
  // ----------------------------------------------------------------------------------------------------------------

  ngOnInit() {
    this.loadInstalledItems().then(items => this.itemsApproved.addRange(items));
    this.watcher.reset().then(
      () => this.watcher.changeEvent.subscribe((event: FileEvent) => this.updateList(event))
    );

    this.dataSourcePending = new ListDataSource(this.itemsPending);
    this.dataSourceApproved =  new ListDataSource(this.itemsApproved);
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Public methods
  // ----------------------------------------------------------------------------------------------------------------

  updateList(event: FileEvent): void {
    if (event.event === 'unlink') {
      this.zone.run(() => this.itemsPending.remove(i => i.path === event.path));
      return;
    }

    this.promise.then(async () => {
      const newItem = {name: event.name, path: event.path};
      const isInstalled = await this.isInstalled(newItem);
      if (isInstalled) {
        return;
      }
      const avail = _.some(this.itemsPending.entries, item => item.name === newItem.name);
      if (!avail) {
        this.zone.run(() => this.itemsPending.add(newItem));
        this.sendNotification({
          title: 'Notification',
          body: 'A new file is being registered and is waiting for installing'
        });
      }
    });
  }

  async save(item: IFileInfo) {
    const hash = await this.crypto.createHash(item.path);
    const items = await this.storage.getCollection('items').find({hash, path: item.path});
    if (items && items.length) {
      this.logger.info('Item is already in database');
      return;
    }
    const newItem: IFileInfo = await this.storage.getCollection('items').insert({
      name: item.name, hash, path: item.path, id: UUID.UUID(), time: new Date()});
    this.itemsPending.remove(i => i.path === newItem.path);
    return this.findAll();
  }

  async undo(item: IFileInfo) {
    await this.storage.getCollection('items').remove(item.id);
    this.itemsPending.add(item);
    this.findAll();
  }

  async removeItem(item: IFileInfo) {
    await this.storage.getCollection<IFileInfo>('items').remove(item.id);
    this.findAll();
  }

  async removeAll(): Promise<number> {
    const count = await this.storage.getCollection<IFileInfo>('items').removeAll();
    this.reload();
    return count;
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Internals
  // ----------------------------------------------------------------------------------------------------------------

  private loadInstalledItems(): Promise<IFileInfo[]> {
    this.promise = this.storage.getCollection('items').findAll() as Promise<IFileInfo[]>;
    return this.promise;
  }

  private async findAll(): Promise<void> {
    this.itemsApproved.entries = await this.storage.getCollection('items').findAll();
  }

  private async isInstalled(item: IFileInfo): Promise<boolean> {
    const avail = _.some(this.itemsApproved.entries, i => i.name === item.name);
    if (!avail) {
      return false;
    }
    const hash = await this.crypto.createHash(item.path);
    const items = await this.storage.getCollection('items').find({hash, path: item.path});
    if (items && items.length) {
      return true;
    }
    return false;
  }

  private reload(): void {
    this.findAll();
  }

  private sendNotification(notify: INotification): any {
    this.notification.createNotification(notify);
  }

}


