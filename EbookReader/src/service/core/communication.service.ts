import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CommunicationService {
  constructor() {}

  // Observable string sources
  private sidebarSource = new Subject<any>();

  // Observable string streams
  sidebarStream$ = this.sidebarSource.asObservable();

  // Service message commands
  showSidebar(payload: any) {
    this.sidebarSource.next(payload);
  }
}
