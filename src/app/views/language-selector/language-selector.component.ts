import { Component } from '@angular/core';
import { LanguageCode } from '../../enums/languageCode';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-language-selector',
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css'
})
export class LanguageSelectorComponent {
  supportedLanguages = Object.values(LanguageCode);
  currentLang: LanguageCode = LanguageCode.EN;

  constructor(private router: Router, private translate: TranslateService) {
    this.currentLang = this.parseCurrentLang(this.translate.currentLang);

    // this.translate.onLangChange.subscribe((e: LangChangeEvent) => {
    //   this.langSubject.next(e.lang);
    // });
  }

  onLanguageSelect(selectedLang: LanguageCode): void {
    const formattedLang = selectedLang.toLowerCase();
    this.translate.use(formattedLang);

    const urlSegments = this.router.url.split('/');
    urlSegments[1] = formattedLang;
    this.router.navigate(urlSegments.join('/').split('/'));
  }

  parseCurrentLang(currentLang: string): LanguageCode {
    if (currentLang.toLowerCase() === 'en') {
      return LanguageCode.EL;
    }

    return LanguageCode.EN;
  }
}
