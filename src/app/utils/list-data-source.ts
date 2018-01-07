import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

import { List, IList } from './list';

export class ListDataSource<T> extends DataSource<any> {

  // ----------------------------------------------------------------------------------------------------------------
  // Constructor
  // ----------------------------------------------------------------------------------------------------------------

  constructor(private source: IList<T>) {
    super();
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Public methods
  // ----------------------------------------------------------------------------------------------------------------

  connect(): Observable<T[]> {
    return this.source.dataChange;
  }

  disconnect() {
    // Not implemented
  }

}
