import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'link'
})
export class LinkPipe implements PipeTransform {

  templateRegex = /href(\s*)=(\s*)"([^\#][a-zA-Z0-9\-\_\.\~\!\@\#\$\%\^\&\*\+\=\|\(\)\[\]\{\}\?\:\;\/\s]+)"/g;
	
  constructor() {}
 
  public transform(value: any): string {
    let trustedValue = value.replace(this.templateRegex, 'onclick="openLink(\'$3\')"');
    return trustedValue;
  }

}
