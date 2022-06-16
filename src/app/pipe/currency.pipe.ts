import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tlhCurrency'
})
export class CurrencyPipe implements PipeTransform {

    transform(value: any): any {
        if (!value || isNaN(value)) {
            return '';
        }
        return Number(value);
    }
}
