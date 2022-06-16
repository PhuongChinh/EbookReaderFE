import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'dialog-del',
  templateUrl: './dialog-del.component.html',
  styleUrls: ['./dialog-del.component.css']
})
export class DialogDelComponent implements OnInit {

  @ViewChild('content') private content: any

  @Input() item: { name: string, id: any } = { name: '', id: 0 }
  @Input() title: string = 'Confirmation'

  @Output() remove = new EventEmitter<any>()

  closeResult: string
  refModal: any

  constructor(protected modalService: BsModalService,
    protected toastr: ToastrService) { }

  ngOnInit() {
  }

  onRemove() {
    
    this.remove.emit(this.item)
    this.refModal.hide();
  }

  onClose() {
    this.refModal.hide();
  }

  open() {
    this.refModal = this.modalService.show(this.content);
  }

  get description(): string {
    return this.item.name;
  }
}
