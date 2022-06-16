import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capName'
})
export class CapNamePipe implements PipeTransform {

  transform(value: string) {
    return this.__shortName(value);
  }

  __shortName(fullName:any) {
    let s = 'ZZ';
    if (fullName) {
      let ss = fullName.replace(/[^\w\s]/gi, ' ').trim().split(/[\s]+/);
      if (ss.length > 0) {
        if (ss.length > 1) {
          s = ss[0].charAt(0) + ss[1].charAt(0);
        } else {
          s = ss[0].charAt(0)/* + ss[0].charAt(1)*/;
        }
      }
    }
    let shortName = s.toUpperCase();
    return shortName;
  }
}
