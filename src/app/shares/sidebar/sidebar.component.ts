import { Component, OnInit } from "@angular/core";
import { UserServiceService, UserSessionService } from "../../service";
import { Router } from "@angular/router";
import { CommunicationService } from "src/app/service/core/communication.service";

@Component({
  selector: "sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  public mode: string = "hide";
  public visible: boolean = false;
  constructor(
    public session: UserSessionService,
    private router: Router,
    private commService: CommunicationService,
    protected userService: UserServiceService
  ) {
    this.commService.sidebarStream$.subscribe((params) => {
      if (this.mode == "show") {
        this.mode = "hide";
      } else {
        this.mode = "show";
      }
    });
  }
  check: boolean = false;
  ngOnInit() {
    if (this.session.user.firstLoginAfterAdminReset) {
      this.check = true;
      return;
    }
  }

  get accessHomepage() {
    return this.session.isAdmin;
  }


  toggleSidebar(): void {
    this.visible = !this.visible;
  }

  signOut() {
    // TODO need to confirm if user want to sign-out or not
    this.userService.logoutUser();
    this.session.clearSession();
    this.router.navigate(["/ui/login"]);
  }
}
