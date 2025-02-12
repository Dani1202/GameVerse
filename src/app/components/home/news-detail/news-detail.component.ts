import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import i18next from 'i18next';

interface News {
  title: { [key: string]: string };
  subtitle?: { [key: string]: string };
  img: string;
  introduction?: { [key: string]: string[] };
  sections?: Array<{
    title: string;
    content: { [key: string]: string[] };
    images?: string[];
  }>;
}

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
  news: News | null = null;
  currentLanguage: string = 'es';
  showLightbox: boolean = false; 
  allImages: string[] = []; // Array to store all images for lightbox.
  currentImage: number = 0; // Current image index in the lightbox.
  
  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService
  ) {}

  formatURL(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }

  ngOnInit(): void {
    this.currentLanguage = i18next.language;
    
    // News data based on the title
    this.route.paramMap.subscribe(params => {
      const title = params.get('title');
      if (title) {
        this.homeService.getHomeNews().subscribe((newsData: News[]) => {
          const newsFromHome = newsData.find(news => this.formatURL(news.title['es']) === title);
          this.news = newsFromHome || null;

          if (this.news?.sections) {
            this.allImages = this.news.sections.flatMap(section => section.images || []);
          }
        });
      }
    });
  }

  openLightbox(imageIndex: number): void {
    this.currentImage = imageIndex;   
    this.showLightbox = true;         
  }

  closeLightbox(): void {
    this.showLightbox = false;
  }
  
  prevImage(): void {
      this.currentImage = (this.currentImage - 1 + this.allImages.length) % this.allImages.length; 
  }
  
  nextImage(): void {  
      this.currentImage = (this.currentImage + 1) % this.allImages.length;
  }
}
