import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'tlhLocalDate'
})
export class LocalDatePipe implements PipeTransform {

  transform(dateTime: any): any {
    if (!dateTime) {
      return '';
    }
    var datePipe = new DatePipe('en-US');
    let dateString = datePipe.transform(dateTime, 'dd/MM/yyyy');
    return dateString;
  }
}
