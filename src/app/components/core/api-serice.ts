import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, share } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // ლოკალჰოსტის API მისამართი
  public BaseApi = 'http://127.0.0.1:8000/api/v1/';
  // პროდაქშენის API მისამართი (გამოყენებისთვის დააკომენტარეთ ზემოთ, გააქტიურეთ ეს)
  // public BaseApi = 'https://admin.blackbird.ge/api/v1/';

  public langStrings: any = {};
  constructor(public http: HttpClient) {
    this.getLangStrings()
  }

  /**
   * ლოგირების ფუნქცია მხოლოდ დეველოპერულ რეჟიმში
   */
  private devLog(message: string, ...data: any[]): void {
    if (isDevMode()) {
      console.log(`[DEV] ${message}`, ...data);
    }
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

  getFooterData(): Observable<any> {
    if (!this.http) {
      return of(null);
    }
    return this.http.get(`${this.BaseApi}footer`).pipe(share());
  }

  getLangStrings(): any {
    this.http
      .get(`${this.BaseApi}strings`)
      .pipe(share())
      .subscribe((langStrings) => {
        this.langStrings = langStrings;
      });
  }

  getLanguages(): Observable<any> {
    return this.http.get(`${this.BaseApi}languages`).pipe(share());
  }

  getSeoData(page: string): Observable<any> {
    return this.http.get(`${this.BaseApi}seo/${page}`).pipe(share());
  }
}
