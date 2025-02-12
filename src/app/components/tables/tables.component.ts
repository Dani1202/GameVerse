import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { TablesService } from 'src/app/services/tables.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  years = ['2024', '2023', '2022'];
  filters = [
    { key: 'letter', label: 'Letra', options: ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(letter => letter !== 'Ñ')] },
    { key: 'price', label: 'Precio', options: ['0 - 20€', '20 - 50€', '50 - 80€'], dropdownClass: 'positionF2' },
    { key: 'platform', label: 'Plataforma', options: ['Todas', 'PS5', 'PC', 'Xbox', 'Switch'], dropdownClass: 'positionF3' },
    { key: 'genre', label: 'Género', options: ['Todos', 'Acción', 'Aventura', 'Lucha', 'Supervivencia', 'Deportes', 'Puzles', 'Terror', 'VR'] },
    { key: 'pegi', label: 'PEGI', options: ['Todos', '3', '7', '12', '16', '18'], dropdownClass: 'positionF2' },
    { key: 'month', label: 'Mes', options: ['Todos', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'], dropdownClass: 'positionF3' }
  ];

  selectedFilter: { [year: string]: { [key: string]: string } } = {
    '2022': { letter: '', price: '', platform: 'Todas', genre: 'Todos', pegi: 'Todos', month: 'Todos' },
    '2023': { letter: '', price: '', platform: 'Todas', genre: 'Todos', pegi: 'Todos', month: 'Todos' },
    '2024': { letter: '', price: '', platform: 'Todas', genre: 'Todos', pegi: 'Todos', month: 'Todos' }
  };

  filteredGames: { [year: string]: any[] } = {
    '2022': [], '2023': [], '2024': []
  };

  games: { [year: string]: any[] } = {
    '2022': [], '2023': [], '2024': []
  };

  visibleColumns: { [year: string]: string[] } = {
    '2022': [], '2023': [], '2024': []
  };

  allColumns: { [year: string]: string[] } = {
    '2022': [], '2023': [], '2024': []
  };

  dropdownStates: { [year: string]: { [key: string]: boolean } } = {
    '2022': {}, '2023': {}, '2024': {}
  };

  currentPage: { [year: string]: number } = {
    '2022': 1, '2023': 1, '2024': 1
  };

  itemsPerPage: number = 5;

  get totalPages(): { [year: string]: number } {
    const result: { [year: string]: number } = {};
    this.years.forEach(year => {
      result[year] = Math.ceil(this.filteredGames[year].length / this.itemsPerPage);
    });
    return result;
  }

  constructor(private tablesService: TablesService) { }

  ngOnInit() {
    this.initializeTables();
  }

  // Method to initialize game data for each year from the service
  initializeTables() {
    this.tablesService.getGames2024().subscribe(data => {
      this.games['2024'] = data.games;
      this.filteredGames['2024'] = [...this.games['2024']];
      this.allColumns['2024'] = data.columns;
      this.visibleColumns['2024'] = [...data.columns];
    });

    this.tablesService.getGames2023().subscribe(data => {
      this.games['2023'] = data.games;
      this.filteredGames['2023'] = [...this.games['2023']];
      this.allColumns['2023'] = data.columns;
      this.visibleColumns['2023'] = [...data.columns];
    });

    this.tablesService.getGames2022().subscribe(data => {
      this.games['2022'] = data.games;
      this.filteredGames['2022'] = [...this.games['2022']];
      this.allColumns['2022'] = data.columns;
      this.visibleColumns['2022'] = [...data.columns];
    });
  }


  getDropdownClasses(filter: any, year: string): { [key: string]: boolean } {
    return {
      'show': this.isDropdownOpen(filter.key, year),
      [filter.dropdownClass]: !!filter.dropdownClass
    };
  }

  toggleDropdown(dropdown: string, year: string) {
    this.dropdownStates[year][dropdown] = !this.dropdownStates[year][dropdown];

    // Close all other dropdowns
    Object.keys(this.dropdownStates[year]).forEach(key => {
      if (key !== dropdown) {
        this.dropdownStates[year][key] = false;
      }
    });
  }

  isDropdownOpen(dropdown: string, year: string): boolean {
    return this.dropdownStates[year][dropdown];
  }

  selectFilter(key: string, option: string, event: Event, year: string) {
    event.stopPropagation();
    this.selectedFilter[year][key] = option;
    this.dropdownStates[year][key] = false;
    this.applyFilters(year);
  }

  applyFilters(year: string) {
    this.filteredGames[year] = this.games[year].filter(game => {
      return (
        this.matchesLetter(game.title, year) &&
        this.matchesPriceRange(game.price, year) &&
        this.matchesPlatform(game.platform, year) &&
        this.matchesGenre(game.genre, year) &&
        this.matchesPegi(game.pegi, year) &&
        this.matchesMonth(game.releaseDate, year)
      );
    });
    this.currentPage[year] = 1;
  }

  matchesLetter(title: string, year: string): boolean {
    const selectedLetter = this.selectedFilter[year]['letter'];
    if (selectedLetter === '') return true;
    return selectedLetter === '#' ? /^[0-9]/.test(title) : title.startsWith(selectedLetter);
  }

  matchesPriceRange(price: number, year: string): boolean {
    const selectedPrice = this.selectedFilter[year]['price'];
    if (selectedPrice === '') return true;
    const [min, max] = selectedPrice.split(' - ').map(val => parseFloat(val.replace('€', '')));
    return price >= min && price <= max;
  }

  matchesPlatform(platform: string, year: string): boolean {
    const selectedPlatform = this.selectedFilter[year]['platform'];
    return selectedPlatform === 'Todas' || platform.includes(selectedPlatform);
  }

  matchesGenre(genre: string, year: string): boolean {
    const selectedGenre = this.selectedFilter[year]['genre'];
    return selectedGenre === 'Todos' || genre.includes(selectedGenre);
  }

  matchesPegi(pegi: string, year: string): boolean {
    const selectedPegi = this.selectedFilter[year]['pegi'];
    if (selectedPegi === 'Todos') return true;
    return pegi == selectedPegi;
  }

  matchesMonth(releaseDate: string, year: string): boolean {
    const selectedMonth = this.selectedFilter[year]['month'];
    return selectedMonth === 'Todos' || releaseDate === selectedMonth;
  }

  // Toggle the visibility of columns
  toggleColumn(column: string, year: string) {
    const allCols = this.allColumns[year];
    let visibleCols = this.visibleColumns[year];

    if (visibleCols.includes(column)) {
      visibleCols = visibleCols.filter(col => col !== column);
    } else {
      visibleCols = [...visibleCols, column];
    }
    this.visibleColumns[year] = allCols.filter(col => visibleCols.includes(col));
  }

  isColumnVisible(column: string, year: string): boolean {
    return this.visibleColumns[year].includes(column);
  }

  getFilteredGames(year: string): any[] {
    const start = (this.currentPage[year] - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredGames[year].slice(start, end);
  }

  changePage(year: string, newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages[year]) {
      this.currentPage[year] = newPage;
    }
  }

  exportToExcel(tableId: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById(tableId));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'juegos_destacados.xlsx');
  }

  // Get the appropriate class for the table based on the year
  getTableClass(year: string): string {
    switch (year) {
      case '2024':
        return 'firstTable';
      case '2023':
        return 'secondTable';
      case '2022':
        return 'thirdTable';
      default:
        return '';
    }
  }
}