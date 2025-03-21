import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, share } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public BaseApi = 'https://admin.blackbird.ge/api/v1/';
  public langStrings: any = {};
  constructor(public http: HttpClient) {
    this.getLangStrings()
  }

  getTeams(): Observable<any> {
    if (!this.http) {
      return of(null);
    }
    return this.http.get(`${this.BaseApi}partners?per_page=50`).pipe(share());
  }

  getCaseStudies(page: number, id?: string): Observable<any> {
    const endUrl = id ? `&service_id=${id}` : ''
    if (!this.http) {
      return of(null);
    }
    return this.http
      .get(`${this.BaseApi}case-studies?page=${page}&per_page=10${endUrl}`)
      .pipe(share());
  }

  getCaseStudy(id: String): Observable<any> {
    if (!this.http) {
      return of(null);
    }
    return this.http.get(`${this.BaseApi}case-studies/${id}`).pipe(share());
  }

  getServices(): Observable<any> {
    if (!this.http) {
      return of(null);
    }

    return this.http.get(`${this.BaseApi}services`).pipe(share());
  }

  getService(id: string): Observable<any> {
    if (!this.http) {
      return of(null);
    }
    return this.http.get(`${this.BaseApi}services/${id}`).pipe(share());
  }

  postContactUs(payload: any) {
    return this.http.post(`${this.BaseApi}email`, payload);
  }

  getGeneralSettings(): Observable<any> {
    if (!this.http) {
      return of(null);
    }
    return this.http.get(`${this.BaseApi}general-settings`).pipe(share());
  }

  getAbout(): Observable<any> {
    if (!this.http) {
      return of(null);
    }
    return this.http.get(`${this.BaseApi}pages/about`).pipe(share());
  }

  getAboutInner(): Observable<any> {
    if (!this.http) {
      return of(null);
    }
    return this.http.get(`${this.BaseApi}pages/branding`).pipe(share());
  }

  gethomeData(): Observable<any> {
    if (!this.http) {
      return of(null);
    }
    return this.http.get(`${this.BaseApi}pages/home`).pipe(share());
  }
  getLangStrings(): any {
    this.http
      .get(`${this.BaseApi}strings`)
      .pipe(share())
      .subscribe((langStrings) => {
        this.langStrings = langStrings;
      });
  }
}
