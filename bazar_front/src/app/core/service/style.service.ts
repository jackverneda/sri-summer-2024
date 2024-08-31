import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StyleService {
  $styleChanged = new Subject<any>();
  public baseColor: string = '#eb2228';
  public bgImg: string = '../../../assets/images/auth/authbackground.jpg';
  public apisecret: string = '7496fa33971cdfa2aeb43b9c446b21be';
  protected baseUrl = 'https://api.imagga.com/v2/colors';

  constructor(protected http: HttpClient) {}

  setImage(img: string) {
    this.bgImg = img;
    this.$styleChanged.next(this.bgImg);
  }

  async updateColor() {
    await this.getColorFromImg(this.bgImg).subscribe((data: any) => {
      this.baseColor = data.result.colors.image_colors[0].closest_palette_color_html_code;
    });
  }

  getColorFromImg(url: string) {
    let params = new HttpParams().set('image_url', url);
    let headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa('api:' + this.apisecret));
    return this.http.get(`${this.baseUrl}`, { headers: headers, params: params });
  }
}
