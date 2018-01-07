import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface IList<T> {
  entries: T[];
  dataChange: BehaviorSubject<T[]>;
  count: number;
  add: (item: T) => T[];
  addRange: (items: T[]) => T[];
  remove: (fun: (item: T) => boolean) => T[];
  removeAt: (index: number) => T[];
  find: () => T;
  clear: () => void;
}

export class List<T> implements IList<T> {

  public dataChange: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  private _items: T[];
  private _count: number;

  // ----------------------------------------------------------------------------------------------------------------
  // Contructor
  // ----------------------------------------------------------------------------------------------------------------

  constructor(...data: T[]) {
    this._items = data && data.length ? [...data] : [];
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Properties
  // ----------------------------------------------------------------------------------------------------------------

  set entries(items: T[]) {
    this._items = items;
    this.triggerChange(this._items);
  }

  get entries(): T[] {
    return this.dataChange.value;
  }

  get count(): number {
    return (this._items || []).length;
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Public methods
  // ----------------------------------------------------------------------------------------------------------------

  add(item: T): T[] {
    this._items.push(item);
    this.triggerChange(this._items);

    return this._items;
  }

  addRange(items: T[]): T[] {
    items.map(i => this._items.push(i));
    this.triggerChange(this._items);

    return this._items;
  }

  remove(fun: (item: T) => boolean): T[] {
    const index = this._items.findIndex(fun);
    this._items.splice(index, 1);
    this.triggerChange(this._items);

    return this._items;
  }

  removeAt(index: number): T[] {
    if (index >= this._items.length) {
      return this._items;
    }
    this._items.splice(index, 1);
    this.triggerChange(this._items);

    return this._items;
  }

  clear(): void {
    this._items = [];
    this.triggerChange(this._items);
  }

  find(): T {
    throw new Error('Not implemented yet');
  }

  // ----------------------------------------------------------------------------------------------------------------
  // Internals
  // ----------------------------------------------------------------------------------------------------------------

  private triggerChange(data: T[]) {
    this.dataChange.next(data);
  }

}
