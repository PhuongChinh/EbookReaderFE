import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ConfirmService {
  constructor() {}

  // Observable string sources
  private requestSource = new Subject<any>();
  private responseSource = new Subject<any>();

  // Observable string streams
  request$ = this.requestSource.asObservable();
  response$ = this.responseSource.asObservable();

  // Service message commands
  sendRequest(payload: any) {
    this.requestSource.next(payload);
  }
  sendResponse(payload: any) {
    this.responseSource.next(payload);
  }
}
