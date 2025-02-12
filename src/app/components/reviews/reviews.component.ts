import { Component, OnInit } from '@angular/core';
import { Chart, ChartEvent, LegendElement, LegendItem } from 'chart.js/auto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReviewsService } from 'src/app/services/reviews.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})

export class ReviewsComponent implements OnInit {

  constructor(private reviewsService: ReviewsService) { }

  //CHARTS
  chartTypes = [
    { id: 'lineChart', title: 'REVIEWS.LINECHART_TITLE' },
    { id: 'barChart', title: 'REVIEWS.BARCHART_TITLE' },
    { id: 'pieChart', title: 'REVIEWS.PIECHART_TITLE' }
  ];

  lineChart: any
  barChart: any
  pieChart: any;
  private originalBackgroundColors: string[] = [];

  // Function to handle hover event for pie chart legend items, changing their colors
  private handlehoover(e: ChartEvent, legendItem: LegendItem, legend: LegendElement<'pie'>) {
    const backgroundColor = legend.chart.data.datasets[0].backgroundColor;

    if (Array.isArray(backgroundColor)) {
      if (this.originalBackgroundColors.length === 0) {
        this.originalBackgroundColors = [...backgroundColor];
      }

      backgroundColor.forEach((color: string, index: number, colors: any) => {
        colors[index] = index === legendItem.index || color.length === 9 ? color : color + '4D';
      });
      legend.chart.update();
    }
  }

  // Function to handle the mouse leave event for pie chart legend items, restoring original colors
  private handleleave(e: ChartEvent, legendItem: LegendItem, legend: LegendElement<'pie'>) {
    const backgroundColor = legend.chart.data.datasets[0].backgroundColor;

    if (Array.isArray(backgroundColor) && this.originalBackgroundColors.length > 0) {
      backgroundColor.forEach((color: string, index: number, colors: any) => {
        colors[index] = this.originalBackgroundColors[index];
      });
      legend.chart.update();
    }
  }

  //REVIEWS
  reviewFormFields = [
    { id: 'userName', name: 'userName', type: 'text', label: 'REVIEWS.USER', placeholder: 'Ej. Usuario 4', errorMessage: 'REVIEWS.USER_REQUIRED' },
    { id: 'gameTitle', name: 'gameTitle', type: 'text', label: 'REVIEWS.GAME_TITLE', placeholder: 'Ej. The Legend of Zelda', errorMessage: 'REVIEWS.GAME_TITLE_REQUIRED' },
    { id: 'userReview', name: 'userReview', type: 'textarea', label: 'REVIEWS.REVIEW', placeholder: 'Escribe tu reseña aquí...', errorMessage: 'REVIEWS.REVIEW_REQUIRED' }
  ];
  reviewForm: FormGroup = new FormGroup({});
  reviews: any[] = [];

  ngOnInit() {
    this.initializeCharts();
    this.initializeReviews();
  }

  initializeCharts() {
    this.reviewsService.getChartData().subscribe(data => {
      // Initialize the line chart
      this.lineChart = new Chart("lineChart", {
        type: "line",
        data: data.lineChart,
        options: {
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                pointStyle: 'rect',
                padding: 20,
                color: '#333',
                font: { weight: 'bold' }
              }
            }
          },
          scales: {
            y: {
              title: { display: true, text: 'Número de juegos lanzados' },
              beginAtZero: true
            }
          },
          layout: { padding: { left: 20, right: 20 } }
        }
      });

      // Initialize the bar chart
      this.barChart = new Chart("barChart", {
        type: "bar",
        data: data.barChart,
        options: {
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                pointStyle: 'rect',
                padding: 20,
                color: '#333',
                font: { weight: 'bold' }
              }
            },
            tooltip: {
              filter: function (tooltipData) {
                return tooltipData.raw != 0;
              }
            }
          },
          interaction: { intersect: false, mode: 'index' },
          scales: {
            y: {
              title: { display: true, text: 'Ventas en millones de unidades' },
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return value + 'M';
                }
              }
            }
          },
          animation: { duration: 1000, easing: 'easeInOutQuart' },
          layout: { padding: { left: 20, right: 20 } }
        }
      });

      // Initialize the pie chart
      this.pieChart = new Chart("pieChart", {
        type: "pie",
        data: data.pieChart,
        options: {
          aspectRatio: 2.5,
          plugins: {
            legend: {
              onHover: (e, legendItem, legend) => this.handlehoover(e, legendItem, legend),
              onLeave: (e, legendItem, legend) => this.handleleave(e, legendItem, legend),
              position: 'bottom',
              labels: {
                usePointStyle: true,
                pointStyle: 'rect',
                padding: 20,
                color: '#333',
                font: { weight: 'bold' }
              }
            },
          },
          layout: { padding: { left: 20, right: 20 } },
        }
      });

      Chart.defaults.font.family = 'Montserrat, sans-serif';
    });
  }

  initializeReviews() {
    // Create the form with required validators for each field
    this.reviewForm = new FormGroup({
      gameTitle: new FormControl('', Validators.required),
      userName: new FormControl('', Validators.required),
      userReview: new FormControl('', Validators.required)
    });

    // Fetch reviews from the service
    this.reviewsService.getReviews().subscribe(data => {
      this.reviews = data.reviews;
    });
  }

  // Add the new review to the list
  onSubmit() {
    if (this.reviewForm.valid) {
      const newReview = this.reviewForm.value;
      this.reviews.push(newReview);
      this.reviewForm.reset();
    }
  }
}
