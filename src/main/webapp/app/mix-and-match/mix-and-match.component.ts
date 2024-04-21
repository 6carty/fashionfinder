import { Component, OnInit } from '@angular/core';
import { fetchWeatherApi } from 'openmeteo';
import { OutfitService } from '../entities/outfit/service/outfit.service';
import { RatingService } from '../entities/rating/service/rating.service';
import { IOutfit } from '../entities/outfit/outfit.model';
import { IRating, NewRating } from '../entities/rating/rating.model';
import dayjs from 'dayjs/esm';
import { IUser } from '../entities/user/user.model';
import { UserService } from '../entities/user/user.service';
import { AccountService } from '../core/auth/account.service';
import { EMPTY, Observable, switchMap } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DarkModeService } from '../shared/dark-mode.service';

@Component({
  selector: 'jhi-mix-and-match',
  templateUrl: './mix-and-match.component.html',
  styleUrls: ['./mix-and-match.component.scss'],
})
export class MixAndMatchComponent implements OnInit {
  isOccasionDropdownOpen: boolean = false;
  isWeatherDropdownOpen: boolean = false;
  isDateDropdownOpen: boolean = false;
  currentDateStr: string = '';
  currentTimeStr: string = '';
  currentHourTemperature: number | undefined;
  currentHourWeatherCode: number | undefined;
  currentWeatherDescription: string = '';
  currentHourHumidity: number | undefined;
  currentHourPrecipitation: number | undefined;
  currentHourWindSpeed: number | undefined;
  weatherData: any;
  outfitImages: any = [];
  alloutfitImage: any;
  recommendedfilterOutfit: any[] = [];
  filterResults: any;
  placeholders: number[] = [];
  placeholders2: any;
  activeRecommendedFilters: string[] = [];
  styles: string[] = [];
  outfit: any;
  activeFilters: string[] = [];
  filterOutfits: any;
  allfiltersOff: boolean = true;
  searchTerm: string = '';
  likedStates: { rating: IRating[]; bool: Boolean }[] = [];
  showAlternate: boolean[] = [];
  likeOccurence: { outfit: IOutfit; ratingCount: number }[] = [];
  active: String | undefined = '';
  users: IUser[] | null = null;
  user: IUser | undefined = undefined;
  seeallview: boolean = false;
  returnalluser: any;
  darkmode: boolean = false;

  constructor(
    private outfitService: OutfitService,
    private ratingService: RatingService,
    protected userService: UserService,
    protected accountService: AccountService,
    protected darkModeService: DarkModeService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(
        filter(account => !!account?.login), // Filter out falsy accounts
        switchMap(account => {
          if (account) this.active = account.login;
          return this.userService.query();
        }),
        switchMap(usersResponse => {
          this.users = usersResponse.body;
          if (this.users) {
            this.user = this.users.find(user => user.login === this.active);
            console.log('The user is currently', this.user);
            return this.fetchWeatherData(); // Call fetchWeatherData after user data is obtained
          }
          return EMPTY; // If user data is not available, return an empty observable
        })
      )
      .subscribe(() => {
        this.fetchOufit().subscribe(() => {}); // Call fetchOutfit after user data is obtained
      });

    this.getCurrentDateTime(); // Call the method initially
    setInterval(() => {
      this.getCurrentDateTime(); // Call the method every second
    }, 1000);
    // this.fetchWeatherData();
    setInterval(() => {
      this.getCurrentHourData();
    }, 3600000);
    setInterval(() => {
      this.getActiveFilters();
    }, 1000);
    this.darkModeService.darkMode$.subscribe((isdarkmode: boolean) => {
      this.darkmode = isdarkmode;
    });
    console.log(this.darkmode);
  }
  likeOutfit(i: number, a: number): void {
    const outfitId = i;
    this.ratingService.query().subscribe(ratingtable => {
      const ratings = ratingtable.body;
      const rating = ratings?.filter(rating => rating.outfit?.id === outfitId && rating.userRated?.id === this.user?.id);
      if (rating && rating[0] !== undefined) {
        this.ratingService.delete(rating[0].id).subscribe();
      } else {
        const ratedAt = dayjs();
        const addOutfit = this.outfit.find((outfit: IOutfit) => outfit.id === i);
        const newRating: IRating | NewRating = {
          id: null,
          outfit: addOutfit,
          ratedAt: ratedAt,
          userRated: this.user,
        };
        this.ratingService.create(newRating).subscribe({
          next: () => {
            console.log('Rating created successfully.');
            // Handle success if needed
          },
          error: err => {
            console.error('Error creating rating:', err);
            // Handle error if needed
          },
        });
      }
    });
    this.likedStates[a].bool = !this.likedStates[a].bool;
  }
  fetchOufit(): Observable<void> {
    return new Observable<void>(observer => {
      //working on this bit
      const observables = this.outfitService.query().subscribe(outfit => {
        this.outfit = outfit.body;
        // this.outfitImages =outfit.body.image
        var filterUserOutfits = this.outfit?.filter((userOwned: IOutfit) => {
          if (userOwned.userCreated) {
            return userOwned.userCreated.id === this.user?.id;
          }
          // If creator is null, exclude it from the filtered list
          return false;
        });
        this.returnalluser = filterUserOutfits;
        this.alloutfitImage = this.returnalluser.map(
          (outfitPic: { imageContentType: string; image: string }) => 'data:' + outfitPic.imageContentType + ';base64,' + outfitPic.image
        );

        this.activeRecommendedFilters.forEach(filter => {
          if (
            filter === 'Sunny' ||
            filter === 'Rainy' ||
            filter === 'Windy' ||
            filter === 'Cold' ||
            filter === 'Hot' ||
            filter === 'Snowy'
          ) {
            filterUserOutfits = filterUserOutfits.filter((outfit: any) => outfit.description.includes(filter.toLowerCase()) === true);
            this.recommendedfilterOutfit = filterUserOutfits;
            console.log('It filtered Something and that is', this.recommendedfilterOutfit);
          }
        });
        console.log('what is it currently filtering to', this.activeRecommendedFilters);
        if (filterUserOutfits.length == 0) {
          this.outfitImages = this.alloutfitImage.slice(0, 10);
        } else {
          this.outfitImages = filterUserOutfits
            .slice(0, 10)
            .map(
              (outfitPic: { imageContentType: string; image: string }) =>
                'data:' + outfitPic.imageContentType + ';base64,' + outfitPic.image
            );
        }
        const remaining = 5 - this.outfitImages.length;
        this.placeholders = Array.from({ length: remaining }, (_, index) => index); // Generate array of remaining number of placeholders

        for (const soleOutfit of this.outfit) {
          this.ratingService.query().subscribe(ratingTable => {
            const ratings = ratingTable.body;
            if (ratings && ratings.length > 0) {
              const soleOutfitRatings = ratings.filter(rating => rating.outfit?.id === soleOutfit.id); // Filter ratings based on outfit ID
              if (soleOutfitRatings) {
                const ratingCount = soleOutfitRatings.length;
                const newItem = { outfit: soleOutfit, ratingCount };
                const existingItemIndex = this.likeOccurence.findIndex(item => item.outfit.id === newItem.outfit.id);
                console.log(existingItemIndex);
                if (existingItemIndex !== -1) {
                } else {
                  let index = this.likeOccurence.findIndex(item => item.ratingCount < newItem.ratingCount);
                  if (index === -1) {
                    index = this.likeOccurence.length;
                  }
                  if (newItem.ratingCount > 0) {
                    this.likeOccurence.splice(index, 0, newItem);
                  }
                }
                const sendToPopulate = this.likeOccurence;
                this.populateLikedStates(sendToPopulate);
              }
            }
          });
        }

        observables.unsubscribe();
        observer.next(); // Notify observers that the asynchronous operation is complete
        observer.complete();
      });
    });
  }

  getRandomOutfits(outfits: any[], count: number): any[] {
    const randomOutfits = [];
    const outfitsCopy = [...outfits]; // Create a shallow copy of the outfits array

    // Ensure that count doesn't exceed the length of the outfits array
    count = Math.min(count, outfitsCopy.length);

    // Randomly select count outfits from the outfits array
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * outfitsCopy.length);
      randomOutfits.push(outfitsCopy[randomIndex]);
      outfitsCopy.splice(randomIndex, 1); // Remove the selected outfit to avoid duplicates
    }

    return randomOutfits;
  }
  insertSorted(array: { outfit: IOutfit; ratingCount: number }[], newItem: { outfit: IOutfit; ratingCount: number }): void {
    let index = array.findIndex(item => item.ratingCount < newItem.ratingCount);
    if (index === -1) {
      index = array.length;
    }
    array.splice(index, 0, newItem);
    //currently working on this
  }
  populateLikedStates(likeOccurence: { outfit: IOutfit; ratingCount: number }[]): void {
    this.likedStates = [];

    // Create an array of promises for each asynchronous request
    const promises = likeOccurence.map((likeOccurenceItem, index) => {
      return new Promise<void>((resolve, reject) => {
        this.ratingService.query().subscribe(ratingTable => {
          const likeOccurenceLikes = ratingTable.body?.filter(
            rating => likeOccurenceItem.outfit.id === rating.outfit?.id && rating.userRated?.id === this.user?.id
          );

          // Push likedStateItem into the same index as likeOccurenceItem
          this.likedStates[index] = {
            rating: likeOccurenceLikes || [],
            bool: !!(likeOccurenceLikes && likeOccurenceLikes.length > 0),
          };

          resolve(); // Resolve the promise once the asynchronous operation is done
        });
      });
    });

    // Wait for all promises to resolve
    Promise.all(promises).then(() => {
      const remainderTrending = 5 - this.likeOccurence.length;
      if (remainderTrending > 0) {
        this.ratingService.query().subscribe(ratingTable => {
          const ratings = ratingTable.body;
          if (!ratings) {
            this.placeholders2 = this.getRandomOutfits(this.returnalluser, 5);
          } else {
            const noRatedOutfits = this.outfit.filter(
              (soleOutfit: IOutfit) => !ratings.some(rating => rating.outfit?.id === soleOutfit.id)
            );
            this.placeholders2 = this.getRandomOutfits(noRatedOutfits, remainderTrending);
            for (let i = 0; i < this.placeholders2.length; i++) {
              const likedStateItem = {
                rating: [],
                bool: false,
              };

              // Push likedStateItem into the same index as the current iteration
              this.likedStates.push(likedStateItem);
            }
          }
        });
      }
    });
  }
  fetchFilteredOutfit(): void {
    // this.filterOutfits = this.outfit;
    this.filterOutfits = this.outfit?.filter((userOwned: IOutfit) => {
      if (userOwned.userCreated) {
        return userOwned.userCreated.id === this.user?.id;
      }
      // If creator is null, exclude it from the filtered list
      return false;
    });
    const today = new Date();
    this.activeFilters.forEach(filter => {
      if (filter === 'Formal' || filter === 'Business' || filter === 'Casual' || filter === 'Sports') {
        this.filterOutfits = this.filterOutfits.filter((outfit: any) => outfit.occasion === filter.toUpperCase());
      } else if (
        filter === 'Sunny' ||
        filter === 'Rainy' ||
        filter === 'Windy' ||
        filter === 'Cold' ||
        filter === 'Hot' ||
        filter === 'Snowy'
      ) {
        this.filterOutfits = this.filterOutfits.filter((outfit: any) => outfit.description.includes(filter.toLowerCase()) === true);
      } else if (filter === 'Today' || filter === 'Week' || filter === 'Month' || filter === 'Year') {
        if (filter === 'Today') {
          const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Add one day to get the end of today

          this.filterOutfits = this.filterOutfits.filter((outfit: any) => {
            const outfitDate = new Date(outfit.date);
            return outfitDate >= startOfToday && outfitDate < endOfToday;
          });

          // this.filterOutfits = this.filterOutfits.filter((outfit:any) => outfit.date.getDate === today);
        } else if (filter === 'Week') {
          const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()); // Start of current week (Sunday)
          const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7); // End of current week (next Sunday)

          this.filterOutfits = this.filterOutfits.filter((outfit: any) => {
            const outfitDate = new Date(outfit.date);
            return outfitDate >= startOfWeek && outfitDate < endOfWeek;
          });
        } else if (filter === 'Month') {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Get the last day of the current month

          this.filterOutfits = this.filterOutfits.filter((outfit: any) => {
            const outfitDate = new Date(outfit.date);
            return outfitDate >= startOfMonth && outfitDate <= endOfMonth;
          });
        } else if (filter === 'Year') {
          const startOfYear = new Date(today.getFullYear(), 0, 1);
          const endOfYear = new Date(today.getFullYear(), 11, 31); // December 31st of the current year

          this.filterOutfits = this.filterOutfits.filter((outfit: any) => {
            const outfitDate = new Date(outfit.date);
            return outfitDate >= startOfYear && outfitDate <= endOfYear;
          });
        }
      }
    });
    if (this.searchTerm.trim()) {
      this.filterOutfits = this.filterOutfits.filter(
        (outfit: any) => outfit.name.replace(/\s/g, '').toLowerCase().includes(this.searchTerm.replace(/\s/g, '').toLowerCase())
        // outfit.name.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
      );
    }
    this.filterResults = [];
    this.filterResults = this.filterOutfits.map(
      (outfitPic: { imageContentType: string; image: string }) => 'data:' + outfitPic.imageContentType + ';base64,' + outfitPic.image
    );
  }
  showAlternateContent(index: number) {
    this.showAlternate[index] = true;
  }
  resetAlternateContent(index: number) {
    this.showAlternate[index] = false;
  }
  changeToSeeAll(): void {
    this.seeallview = !this.seeallview;
  }
  getCurrentDateTime(): void {
    const currentDate = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const dayOfMonth = currentDate.getDate();
    const month = months[currentDate.getMonth()];

    this.currentDateStr = `${dayOfWeek} ${dayOfMonth}, ${month}`;
    // this.currentDateStr = currentDate.toDateString();
    this.currentTimeStr = currentDate.toLocaleTimeString();
  }

  async fetchWeatherData(): Promise<void> {
    const params = {
      latitude: 52.4814,
      longitude: -1.8998,
      hourly: ['temperature_2m', 'relative_humidity_2m', 'precipitation', 'weather_code', 'wind_speed_10m'],
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);
    const range = (start: number, stop: number, step: number) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    this.weatherData = {
      hourly: {
        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(t => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
        precipitation: hourly.variables(2)!.valuesArray()!,
        weatherCode: hourly.variables(3)!.valuesArray()!,
        windSpeed10m: hourly.variables(4)!.valuesArray()!,
      },
    };
    console.log(this.weatherData);
    this.getCurrentHourData();
  }
  toggleOccasionDropdown(): void {
    this.isOccasionDropdownOpen = !this.isOccasionDropdownOpen;
  }

  toggleWeatherDropdown(): void {
    this.isWeatherDropdownOpen = !this.isWeatherDropdownOpen;
  }
  toggleDateDropdown(): void {
    this.isDateDropdownOpen = !this.isDateDropdownOpen;
  }
  getActiveFilters() {
    var formalElement = <HTMLInputElement>document.getElementById('FormalCheck');
    if (!formalElement) {
      return;
    }
    var businessElement = <HTMLInputElement>document.getElementById('BusinessCheck');
    var casualElement = <HTMLInputElement>document.getElementById('CasualCheck');
    var sportElement = <HTMLInputElement>document.getElementById('SportCheck');
    var sunnyElement = <HTMLInputElement>document.getElementById('WeatherSunny');
    var rainyElement = <HTMLInputElement>document.getElementById('WeatherRainy');
    var windyElement = <HTMLInputElement>document.getElementById('WeatherWindy');
    var coldElement = <HTMLInputElement>document.getElementById('WeatherCold');
    var hotElement = <HTMLInputElement>document.getElementById('WeatherHot');
    var snowyElement = <HTMLInputElement>document.getElementById('WeatherSnowy');
    var todayElement = <HTMLInputElement>document.getElementById('DateToday');
    var weekElement = <HTMLInputElement>document.getElementById('DateWeek');
    var monthElement = <HTMLInputElement>document.getElementById('DateMonth');
    var yearElement = <HTMLInputElement>document.getElementById('DateYear');

    var activeFilters: string[] = [];
    if (formalElement.checked) activeFilters.push('Formal');
    if (businessElement.checked) activeFilters.push('Business');
    if (casualElement.checked) activeFilters.push('Casual');
    if (sportElement.checked) activeFilters.push('Sports');
    if (sunnyElement.checked) activeFilters.push('Sunny');
    if (rainyElement.checked) activeFilters.push('Rainy');
    if (windyElement.checked) activeFilters.push('Windy');
    if (coldElement.checked) activeFilters.push('Cold');
    if (hotElement.checked) activeFilters.push('Hot');
    if (snowyElement.checked) activeFilters.push('Snowy');
    if (todayElement.checked) activeFilters.push('Today');
    if (weekElement.checked) activeFilters.push('Week');
    if (monthElement.checked) activeFilters.push('Month');
    if (yearElement.checked) activeFilters.push('Year');
    this.activeFilters = activeFilters;

    if (this.searchTerm.trim()) {
      // If search term is not empty, consider filters as active
      this.allfiltersOff = false;
    } else {
      // If search term is empty, check if other filters are active
      if (activeFilters.length === 0) {
        this.allfiltersOff = true;
      } else {
        this.allfiltersOff = false;
        this.fetchFilteredOutfit();
      }
    }
  }
  clearFilterSelections() {
    var formalElement = <HTMLInputElement>document.getElementById('FormalCheck');
    var businessElement = <HTMLInputElement>document.getElementById('BusinessCheck');
    var casualElement = <HTMLInputElement>document.getElementById('CasualCheck');
    var sportElement = <HTMLInputElement>document.getElementById('SportCheck');
    var sunnyElement = <HTMLInputElement>document.getElementById('WeatherSunny');
    var rainyElement = <HTMLInputElement>document.getElementById('WeatherRainy');
    var windyElement = <HTMLInputElement>document.getElementById('WeatherWindy');
    var coldElement = <HTMLInputElement>document.getElementById('WeatherCold');
    var hotElement = <HTMLInputElement>document.getElementById('WeatherHot');
    var snowyElement = <HTMLInputElement>document.getElementById('WeatherSnowy');
    var todayElement = <HTMLInputElement>document.getElementById('DateToday');
    var weekElement = <HTMLInputElement>document.getElementById('DateWeek');
    var monthElement = <HTMLInputElement>document.getElementById('DateMonth');
    var yearElement = <HTMLInputElement>document.getElementById('DateYear');
    formalElement.checked = false;
    businessElement.checked = false;
    casualElement.checked = false;
    sportElement.checked = false;
    sunnyElement.checked = false;
    rainyElement.checked = false;
    windyElement.checked = false;
    coldElement.checked = false;
    hotElement.checked = false;
    snowyElement.checked = false;
    todayElement.checked = false;
    weekElement.checked = false;
    monthElement.checked = false;
    yearElement.checked = false;
    this.isOccasionDropdownOpen = false;
    this.isWeatherDropdownOpen = false;
    this.isDateDropdownOpen = false;
    this.searchTerm = '';
    this.allfiltersOff = true; // Set all filters off
  }
  getCurrentHourData(): void {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    // Find the index of the current hour in the weatherData.hourly.time array
    const currentIndex = this.weatherData.hourly.time.findIndex((time: Date) => time.getHours() === currentHour);

    // If the current hour is found in the array
    if (currentIndex !== -1) {
      const temperature = this.weatherData.hourly.temperature2m[currentIndex];
      this.currentHourTemperature = Number(temperature.toFixed(1));
      this.currentHourHumidity = this.weatherData.hourly.relativeHumidity2m[currentIndex];
      this.currentHourPrecipitation = this.weatherData.hourly.precipitation[currentIndex];
      this.currentWeatherDescription = this.getWeatherDescription(this.weatherData.hourly.weatherCode[currentIndex]);
      this.currentHourWindSpeed = this.weatherData.hourly.windSpeed10m[currentIndex];
      if (this.currentHourTemperature < 12) {
        this.activeRecommendedFilters.push('Cold');
      } else if (this.currentHourTemperature > 25) {
        this.activeRecommendedFilters.push('Hot');
      }
      if (this.currentHourWindSpeed) {
        if (this.currentHourWindSpeed > 25) {
          this.activeRecommendedFilters.push('Windy');
        }
      }
    } else {
      console.error('Weather data not available for the current hour.');
    }
  }
  getWeatherDescription(weatherCode: number): string {
    switch (weatherCode) {
      case 0: {
        this.activeRecommendedFilters.push('Sunny');
        return 'Clear Sky';
      }
      case 1: {
        this.activeRecommendedFilters.push('Sunny');
        return 'Mainly clear';
      }
      case 2:
        return 'Partly Cloudy';
      case 3:
        return 'Overcast';
      case 45:
        return 'Fog';
      case 48:
        return 'Depositing rime fog';
      case 51:
        return 'Light drizzle';
      case 53:
        return 'Moderate drizzle';
      case 55:
        return 'Dense drizzle';
      case 56:
        return 'Light freezing drizzle';
      case 57:
        return 'Dense freezing drizzle';
      case 61: {
        this.activeRecommendedFilters.push('Rainy');
        return 'Slight rain';
      }
      case 63: {
        this.activeRecommendedFilters.push('Rainy');
        return 'Moderate rain';
      }
      case 65: {
        this.activeRecommendedFilters.push('Rainy');
        return 'Heavy rain';
      }
      case 66: {
        this.activeRecommendedFilters.push('Rainy');
        return 'Light freezing rain';
      }
      case 67:
        return 'Heavy freezing rain';
      case 71: {
        this.activeRecommendedFilters.push('Snowy');
        return 'Slight snow fall';
      }
      case 73: {
        this.activeRecommendedFilters.push('Snowy');
        return 'Moderate snow fall';
      }
      case 75: {
        this.activeRecommendedFilters.push('Snowy');
        return 'Heavy snow fall';
      }
      case 77:
        return 'Snow grains';
      case 80: {
        this.activeRecommendedFilters.push('Rainy');
        return 'Slight rain showers';
      }
      case 81: {
        this.activeRecommendedFilters.push('Rainy');
        return 'Moderate rain showers';
      }
      case 82: {
        this.activeRecommendedFilters.push('Rainy');
        return 'Violent rain showers';
      }
      case 85: {
        this.activeRecommendedFilters.push('Snowy');
        return 'Slight snow showers';
      }
      case 86: {
        this.activeRecommendedFilters.push('Snowy');
        return 'Heavy snow showers';
      }
      case 95: {
        this.activeRecommendedFilters.push('Rainy');
        return 'Thunderstorm: Slight or moderate';
      }
      case 96: {
        this.activeRecommendedFilters.push('Rainy');
        this.activeRecommendedFilters.push('Snowy');
        return 'Thunderstorm with slight hail';
      }
      case 99: {
        this.activeRecommendedFilters.push('Rainy');
        this.activeRecommendedFilters.push('Snowy');
        return 'Thunderstorm with heavy hail';
      }
      default:
        return 'Unknown weather code: ' + weatherCode; // Handle unknown codes
    }
  }
}
