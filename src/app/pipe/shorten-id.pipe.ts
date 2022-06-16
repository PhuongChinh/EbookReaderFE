import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenID'
})
export class ShortenIDPipe implements PipeTransform {

  transform(value: string, limit: number = 8) {
    if (!value) {
      return value;
    } else if (value.length > limit) {
      return value.substr(value.length - limit).toUpperCase();
    }
    return value.toUpperCase();
  }

}
