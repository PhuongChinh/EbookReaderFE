import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClient, HTTP_INTERCEPTORS, } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AppHttpInterceptor } from "./app-http-interceptor";

import { AppUtilsService, HttpConnectorService, UserSessionService, AppStateService, AppCacheService } from "./service";
import { SharesModule } from "./shares/shares.module";
import { HttpLoaderFactory, } from "./globals";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SharesModule.forRoot(),
  ],
  providers: [
    AppUtilsService,
    HttpConnectorService,
    UserSessionService,
    AppStateService,
    AppCacheService,
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },

  ],
  exports: [SharesModule, BrowserAnimationsModule],
  bootstrap: [AppComponent],
  entryComponents: [],
})
export class AppModule { }
