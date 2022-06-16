import {
  Component,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { Router } from "@angular/router";

import { UserSessionService } from "../../service";
import { UserServiceService } from "../../service";
import { AppStateService } from "../../service";
import { TranslateService } from "@ngx-translate/core";
import { CommunicationService } from "../../service";

@Component({
  selector: "navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit, OnDestroy {
  mobile: boolean = false
  userprofile;
  lang: String;
  showDropdown: boolean = false;

  constructor(
    public translate: TranslateService,
    public state: AppStateService,
    public session: UserSessionService,
    private router: Router,
    protected userService: UserServiceService,
    private commService: CommunicationService,
  ) { }

  ngOnInit() {
    this.lang = this.translate.currentLang;
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 864) {
        this.mobile = true
      } else {
        this.mobile = false
      }
    });

  }
  get langs(): string {
    return this.lang = this.translate.currentLang;
  }
  get urlHome(): string {
    return "/" + this.langs
  }
  ngOnDestroy() {
    window.removeEventListener("resize", () => {
      this.mobile = window.innerWidth <= 864;
    });
  }

  profile() {
    this.router.navigate(["/ui/profiles/personal"]);
  }

  signOut() {
    // TODO need to confirm if user want to sign-out or not
    this.userService.logoutUser();
    this.session.clearSession();
    this.router.navigate(["/ui/login"]);
  }

  searchTimer: any = null;
  onSearch(term: string): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      this.state.searchChange.emit(term);
    }, 600);
  }

  showUserDropdown() {
    // $(".updateAvatarModal")["1"].modal("show");
    this.showDropdown = !this.showDropdown;
    console.log(this.showDropdown)
  }

  showSidebar() {
    this.commService.showSidebar("navbar.showSidebar()");
  }
  get imageURL(): string {
    if (this.session.user && this.session.user.media && this.session.user.media.length > 0)
      return this.session.user.media[0].url;
    else return "assets/images/icons/icon-user.svg";
  }

  get user() {
    return this.session.user ? this.session.user : {};
  }
}

