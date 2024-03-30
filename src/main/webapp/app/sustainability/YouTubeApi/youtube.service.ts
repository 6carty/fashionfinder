import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  constructor(private http: HttpClient) {}

  getFashionGuideVideos(): Observable<any> {
    const apiUrl = 'https://youtube.googleapis.com/youtube/v3/search';
    const params = {
      part: 'snippet',
      maxResults: '5',
      q: 'sustainable fashion guide',
      key: 'AIzaSyBpXg6GTdPdyhcxNmM-BSdvP6a4qtXUZLc',
    };
    return this.http.get(apiUrl, { params });
  }
}
