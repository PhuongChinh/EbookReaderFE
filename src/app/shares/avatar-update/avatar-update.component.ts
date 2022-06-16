import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { AppStateService, UserSessionService } from "src/app/service";


@Component({
  selector: "avatar-update",
  templateUrl: "./avatar-update.component.html",
  styleUrls: ["./avatar-update.component.scss"],
})
export class AvatarUpdateComponent implements OnInit {
  userprofile;
  orgId;
  id;
  customers;
  customerProfiles: any = {};

  parent: any = {};
  refModal: BsModalRef;
  updateCus: FormGroup;

  @Input() item: any = {};
  @Output() onCompleted = new EventEmitter<any>();
  private submitted: boolean;
  constructor(
    public fb: FormBuilder,
    private session: UserSessionService,
    private toastr: ToastrService,
    protected state: AppStateService,
    public translate: TranslateService
  ) { }
  // đăng kí form
  registrationForm = this.fb.group({
    file: [null],
  });

  // file upload
  @ViewChild("fileInput") el: ElementRef;
  imageUrl: any = "assets/images/icons/icon-user.svg";
  editFile: boolean = true;
  removeUpload: boolean = false;
  userRole: any;
  img: File;


  // show thông tin user profile
  ngOnInit() {
    this.userprofile = this.session.user;
    console.log("1:", this.userprofile);
    console.log("2:", this.userprofile.media)
    if (this.userprofile && this.userprofile.media && this.userprofile.media.length > 0) {
      this.url = this.userprofile.media[0].url;
    }
  }


  onSave() {
    if (!(this.img == undefined)) {
      const formData = new FormData();
      formData.append('file', this.img);
      // this.userprofileService.putImage(formData).subscribe((res) => {
      //   if (res.message == "success") {
      //     this.userprofile = res.result;
      //     this.session.setUser(this.userprofile);
      //     this.translate.get('common.messages.success').subscribe((msg: string) => {
      //       this.toastr.success(msg);
      //     });
      //   } else {
      //     this.translate.get('common.messages.fail').subscribe((msg: string) => {
      //       this.toastr.error(msg);
      //     });
      //   }
      // })
    } else {
      this.translate.get('common.messages.surveyFile').subscribe((msg: string) => {
        this.toastr.error(msg);
      });
    }
  }
  onClose() {
    if (this.userprofile && this.userprofile.media && this.userprofile.media.length > 0) {
      this.url = this.userprofile.media[0].url;
    }
  }
  url = undefined;
  onFileChanged(event) {
    this.img = event.target.files[0];
    if (this.img.type === "image/jpeg" || this.img.type === "image/png") {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.translate.get('common.messages.surveyFile').subscribe((msg: string) => {
        this.toastr.error(msg);
      });
      this.img = undefined;
    }
  }
  removeIMG() {
    this.url = undefined
    this.img = undefined
  }

  onSubmit() {
    this.submitted = true;
    if (!this.registrationForm.valid) {
      return false;
    } else {

    }
  }

  get invalid(): boolean {
    if (this.img !== undefined) {
      return false;
    }
    return true;
  }
  get user() {
    return this.session.user ? this.session.user : {};
  }

}
