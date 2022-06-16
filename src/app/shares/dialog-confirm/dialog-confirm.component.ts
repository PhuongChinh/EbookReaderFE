import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";

import { BsModalService } from "ngx-bootstrap/modal";
import { ConfirmService } from "../../service";

@Component({
  selector: "dialog-confirm",
  templateUrl: "./dialog-confirm.component.html",
  styleUrls: ["./dialog-confirm.component.css"],
})
export class DialogConfirmComponent implements OnInit {
  @ViewChild("content") private content: any;
  @Input() title: string = "Confirmation";
  @Input() description: string = "Description";
  @Output() cancel = new EventEmitter<any>();
  @Output() confirm = new EventEmitter<any>();
  @Input() data: any;
  @Input() sender: string;
  refModal: any;
  payload: any;
  constructor(
    protected modalService: BsModalService,
    protected confirmService: ConfirmService
  ) {
    confirmService.request$.subscribe(
      ({ sender, data, title, description }) => {
        if (title) this.title = title;
        if (description) this.description = description;
        if (sender) this.sender = sender;
        if (data) this.data = data;
        this.open();
      }
    );
  }

  ngOnInit() {}

  onConfirm() {
    this.payload = {
      receiver: this.sender,
      data: this.data,
      message: "CONFIRMED",
    };
    this.confirmService.sendResponse(this.payload);
    this.confirm.emit(this.payload);
    this.refModal.hide();
  }

  onCancel() {
    this.payload = {
      receiver: this.sender,
      data: this.data,
      message: "CANCELED",
    };
    this.confirmService.sendResponse(this.payload);
    this.cancel.emit(this.payload);
    this.refModal.hide();
  }

  open() {
    this.refModal = this.modalService.show(this.content);
  }
}
