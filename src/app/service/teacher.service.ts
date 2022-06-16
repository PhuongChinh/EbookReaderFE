import { Injectable } from "@angular/core";
import { HttpConnectorService } from "./core/http-connector.service";
import { CONSUME_API } from "./consume-apis";

@Injectable({
  providedIn: "root",
})
export class TeacherService {
  constructor(
    protected xhr: HttpConnectorService,
  ) { }

  addTeacher(obj: any = {}) {
    return this.xhr.post(CONSUME_API.TEACHER.addTeacher, obj);
  }

  deleteTeacher(obj: any = {}) {
    return this.xhr.post(CONSUME_API.TEACHER.deleteTeacher, obj);
  }

  getTeachers(filter: any = {}) {
    return this.xhr.get(CONSUME_API.TEACHER.teachers, { filter: JSON.stringify(filter) });
  }
}
