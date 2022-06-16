import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'map'
})
export class MapPipe implements PipeTransform {

  transform(value: any, ...fields: Array<string>): Array<any> {
    fields.forEach( field => {
      value = value.map( item => item[field]);
    })
    return value;
  }

}
