import { Component, OnInit } from '@angular/core';

import { ILog } from '../utils/services/logger.service';
import { List } from '../utils/list';
import { ListDataSource } from '../utils/list-data-source';
import { StorageService } from '../utils/services/storage.service';
import { LoggerService } from '../utils/services/logger.service';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.css']
})
export class LoggingComponent implements OnInit {

  public dataSourceLogs: ListDataSource<ILog>;

  private logItems: List<ILog> = new List<ILog>();

  // ----------------------------------------------------------------------------------------------------------------
  // Constructor
  // ----------------------------------------------------------------------------------------------------------------

  constructor(private storage: StorageService,
              private logger: LoggerService) {}

  ngOnInit() {
    this.loadLogs();
    this.dataSourceLogs = new ListDataSource(this.logItems);
  }

  removeAll(): void {
    this.logger.removeAll();
    this.loadLogs();
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Internals
  // ----------------------------------------------------------------------------------------------------------------

  private async loadLogs(): Promise<any> {
    this.logItems.entries = await this.storage.getCollection<ILog>('logs').findAll();
  }

}
