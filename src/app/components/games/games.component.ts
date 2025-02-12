import { Component } from '@angular/core';
import { GamesService } from 'src/app/services/games.service';

interface Game {
  title: string;
  img: string;
  qualification?: number | null;
}

interface Quiz {
  question: string;
  options: string[];
  answer: string;
}

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent {
  gameSections: { key: string; games: Game[] }[] = [
    { key: 'newReleases', games: [] },
    { key: 'upcomingReleases', games: [] },
    { key: 'top100', games: [] },
    { key: 'psPlus', games: [] },
  ];

  // Index tracking for carousel navigation
  startIndex: { [key: string]: number } = {};
  endIndex: { [key: string]: number } = {};

  quizQuestions: Quiz[] = [];
  currentQuizQuestion: Quiz | undefined;
  selectedOption: string | null = null;

  constructor(private gamesService: GamesService) {}

  ngOnInit(): void {
    // Initialize carousel indexes for each section
    this.gameSections.forEach((section) => {
      this.startIndex[section.key] = 0;
      this.endIndex[section.key] = 7;
    });

    // Fetch data for each game section from the GamesService
    this.gamesService.getNewReleasesGames().subscribe((data) => {
      this.gameSections[0].games = data;
    });

    this.gamesService.getUpcomingReleasesGames().subscribe((data) => {
      this.gameSections[1].games = data;
    });

    this.gamesService.getQuizGames().subscribe((data) => {
      this.quizQuestions = data;
      this.selectRandomQuizQuestion();
    });

    this.gamesService.getTop100Games().subscribe((data) => {
      this.gameSections[2].games = data;
    });

    this.gamesService.getPsPlusGames().subscribe((data) => {
      this.gameSections[3].games = data;
    });
  }

  getVisibleGames(type: string): Game[] {
    const section = this.gameSections.find((section) => section.key === type);
    return section
      ? section.games.slice(this.startIndex[type], this.endIndex[type] + 1)
      : [];
  }

  navigateCarousel(type: string, direction: string) {
    const section = this.gameSections.find((section) => section.key === type);
    if (
      direction === 'next' &&
      section &&
      this.endIndex[type] <= section.games.length - 1
    ) {
      this.startIndex[type]++;
      this.endIndex[type]++;
    } else if (direction === 'prev' && this.startIndex[type] > 0) {
      this.startIndex[type]--;
      this.endIndex[type]--;
    }
  }

  formatURL(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }

  getRatingClass(qualification: number | null | undefined): string {
    if (qualification == null) return 'tbdRating';
    return qualification >= 7.5
      ? 'goodRating'
      : qualification >= 6.0
      ? 'mediumRating'
      : 'badRating';
  }

  getRatingText(qualification: number): string {
    return qualification >= 7.5
      ? 'Recomendado'
      : qualification >= 6.0
      ? 'Promedio'
      : 'No recomendado';
  }

  selectRandomQuizQuestion(): void {
    const randomIndex = Math.floor(Math.random() * this.quizQuestions.length);
    this.currentQuizQuestion = this.quizQuestions[randomIndex];
  }

  checkAnswer(option: string): void {
    this.selectedOption = option;
  }
}
