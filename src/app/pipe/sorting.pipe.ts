import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortBy' })
export class SortingPipe implements PipeTransform {

    transform(items: any[], field: string = undefined, asc:boolean = true): any[] {
        if (!items || !Array.isArray(items)) {
          return items;
        }

        if (items.length <= 1) {
          return items;
        }

        items.sort((a, b) => {
          let t1:any = a, t2:any = b;
            if (field && t1 && t2) {
              t1 = t1[field];
              t2 = t2[field];
            }

            if (t1 < t2) {
              return asc ? -1 : 1;
            }
                
            if (t1 > t2) {
              return asc ? 1 : -1;
            }
                
            return 0;
        });

        return items;
    }
}