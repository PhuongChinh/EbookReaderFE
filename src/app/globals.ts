
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PopoverConfig } from 'ngx-bootstrap/popover';
import { HttpClient, } from '@angular/common/http';


export const ENABLE_SOCIAL = false;

export function CustomPopoverConfig(): PopoverConfig {
  return Object.assign(new PopoverConfig(), {
    container: 'body',
    outsideClick: true,
    delay: 600
  });
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
