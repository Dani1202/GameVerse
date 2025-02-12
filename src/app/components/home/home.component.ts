import { Component } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import i18next from 'i18next';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  newsItems: any[] | undefined; // Holds news articles fetched from the home service
  top100Games: any[] | undefined; // Stores the top 100 games data
  currentGameIndex: number = 0;
  buttonsHome: any[] | undefined;
  currentLanguage: string = 'es';

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.currentLanguage = i18next.language;

    this.homeService.getHomeNews().subscribe((data) => {
      this.newsItems = data;
    });
    this.homeService.getTop100Games().subscribe((data) => {
      this.top100Games = data;
    });
    this.homeService.getButtons().subscribe((data) => {
      this.buttonsHome = data;
    });
  }

  formatURL(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }

  getRatingClass(qualification: number): string {
    if (qualification >= 7.5) {
      return 'goodRating';
    } else if (qualification >= 6.0) {
      return 'mediumRating';
    } else {
      return 'badRating';
    }
  }

  nextGames() {
    this.currentGameIndex =
      (this.currentGameIndex + 4) % this.top100Games!.length;
  }
  prevGames() {
    this.currentGameIndex =
      (this.currentGameIndex - 4 + this.top100Games!.length) %
      this.top100Games!.length;
  }
}
