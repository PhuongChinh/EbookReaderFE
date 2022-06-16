import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {

  transform(value: any, limit: number = 200) {
    if (!value) {
      return value;
    } else if (value.length > limit) {
      return value.substr(0, limit) + '...';
    }
    return value;
  }

}
