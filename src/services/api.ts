import { Injectable } from '@angular/core';
import { Http, RequestOptions, RequestOptionsArgs } from '@angular/http';

@Injectable()
export class ApiService {
  defaultOptions: RequestOptions;

  constructor(private http: Http) {
    this.defaultOptions = new RequestOptions({ withCredentials: true });
  }

  get(url: string, body: any, options?: RequestOptionsArgs) {
    const queryString = buildQuery(body);

    return this.http
      .get(
        url + (queryString.length > 0 ? '?' + queryString : ''),
        this.defaultOptions.merge(options)
      )
      .map(response => response.json());
  }

  post(url: string, body: any, options?: RequestOptionsArgs) {
    return this.http
      .post(url, body, this.defaultOptions.merge(options))
      .map(response => response.json());
  }

  put(url: string, body: any, options?: RequestOptionsArgs) {
    return this.http
      .put(url, body, this.defaultOptions.merge(options))
      .map(response => response.json());
  }
}

function buildQuery(data: Object) {
  const query = [];

  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      query.push(
        encodeURIComponent(prop) + '=' + encodeURIComponent(data[prop])
      );
    }
  }

  return query.join('&');
}
