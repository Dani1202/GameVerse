import { Component, Inject } from '@angular/core';
import { I18NEXT_SERVICE, ITranslationService } from 'angular-i18next';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  // Stores the currently selected language, defaulting to 'es' (Spanish) if not set
  language: string = localStorage.getItem('selectedLanguage') || 'es';
  // Available languages
  languages: string[] = ['es', 'en', 'fr', 'de', 'zh'];
  // To toggle the language selection dropdown
  showLanguage: boolean = false;
  // To control the search bar expansion
  searchExpanded: boolean = false;

  constructor(
    @Inject(I18NEXT_SERVICE) private i18NextService: ITranslationService,
    private loginService: LoginService
  ) {}

  // Toggles the visibility of the search bar
  toggleSearch() {
    this.searchExpanded = !this.searchExpanded;
  }
  // Toggles the visibility of the language selection dropdown
  toggleLanguage() {
    this.showLanguage = !this.showLanguage;
  }

  // Prevents event propagation (used to stop click events from closing the dropdown)
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  changeLanguage(lang: string) {
    if (lang !== this.i18NextService.language) {
      this.i18NextService.changeLanguage(lang).then((x) => {
        localStorage.setItem('selectedLanguage', lang);
        document.location.reload();
      });
    }
  }
}
