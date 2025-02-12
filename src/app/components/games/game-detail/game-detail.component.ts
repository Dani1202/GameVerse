import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GamesService } from 'src/app/services/games.service';
import i18next from 'i18next';

interface Game {
  title: string;
  img: string;
  video: string;
  text: string;
  qualification: number;
  release: string;
  consoles: string[];
  screenshots: string[];
  purchaseUrl: string;
}

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.scss'],
})
export class GameDetailComponent implements OnInit {
  game: Game | null = null; // Holds the game details
  currentLanguage: string = 'es'; // Default language (Spanish)
  showLightbox: boolean = false; // Controls the visibility of the lightbox
  currentImage: number = 0; // Tracks the current image in the lightbox

  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService
  ) {}

  formatURL(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }

  ngOnInit(): void {
    this.currentLanguage = i18next.language;

    // Subscribe to the route parameters to get the game title
    this.route.paramMap.subscribe((params) => {
      const title = params.get('title');
      if (title) {
        this.loadGameDetails(title);
      }
    });
  }

  loadGameDetails(title: string): void {
    const formatTitle = this.formatURL(title);

    // Array of game data observables (fetches different game categories)
    const gameSources = [
      this.gamesService.getNewReleasesGames(),
      this.gamesService.getUpcomingReleasesGames(),
      this.gamesService.getTop100Games(),
      this.gamesService.getPsPlusGames(),
    ];

    // Loop through each game source and search for the game by formatted title
    for (let i = 0; i < gameSources.length; i++) {
      gameSources[i].subscribe((gamesData: Game[]) => {
        const foundGame = gamesData.find(
          (game) => this.formatURL(game.title) === formatTitle
        );
        if (foundGame) {
          this.game = foundGame;
          return;
        }
      });
    }
  }

  getRatingClass(qualification: number | null | undefined): string {
    if (qualification == null) {
      return 'tbdRating';
    }
    return qualification >= 7.5
      ? 'goodRating'
      : qualification >= 6.0
      ? 'mediumRating'
      : 'badRating';
  }

  // Redirect to the game's purchase URL (if available)
  redirectToPurchase(): void {
    if (this.game && this.game.purchaseUrl) {
      window.open(this.game.purchaseUrl);
    } else {
      console.error('No se encontró una URL de compra para este juego.');
    }
  }

  openLightbox(index: number): void {
    this.currentImage = index;
    this.showLightbox = true;
  }

  closeLightbox(): void {
    this.showLightbox = false;
  }

  prevImage(): void {
    if (this.game && this.game.screenshots.length > 0) {
      this.currentImage =
        (this.currentImage - 1 + this.game.screenshots.length) %
        this.game.screenshots.length;
    }
  }

  nextImage(): void {
    if (this.game && this.game.screenshots.length > 0) {
      this.currentImage =
        (this.currentImage + 1) % this.game.screenshots.length;
    }
  }
}
