import { Injectable } from "@angular/core";
import { HttpConnectorService } from "./core/http-connector.service";
import { CONSUME_API } from "./consume-apis";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(
    protected xhr: HttpConnectorService,
  ) { }

  create(user?: any) {
    return this.xhr.post(CONSUME_API.USERS.create, user);
  }

  update(user?: any) {
    return this.xhr.put(CONSUME_API.USERS.update + "/" + user.id, user);
  }

  delete(user?: any) {
    return this.xhr.delete(CONSUME_API.USERS.delete + "/" + user.id);
  }

  updateStatus(user?: any) {
    return this.xhr.put(CONSUME_API.USERS.updateStatus + "/" + user.id, user);
  }

  resetPassword(ev: any) {
    return this.xhr.post(CONSUME_API.AUTH_USERS.userResetPass, {
      userId: ev.id,
      password: ev.newPass,
    });
  }

  checkUser(filter) {
    return this.xhr.get(CONSUME_API.USERS.validate, filter)
  }
}
