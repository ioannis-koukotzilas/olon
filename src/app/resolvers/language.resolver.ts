import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { LanguageCode } from "../enums/languageCode";

@Injectable({ providedIn: 'root' })
export class LanguageResolver implements Resolve<LanguageCode> {
  constructor(private translate: TranslateService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<LanguageCode> {
    const langParam = (route.paramMap.get('lang') || 'en').toLowerCase();
    const selectedLang: LanguageCode = langParam === 'el' ? LanguageCode.EL : LanguageCode.EN;
    this.translate.use(selectedLang.toLowerCase());
    return of(selectedLang);
  }
}