import { inject, Injectable } from '@angular/core';

import { environment } from '@env/environment';

import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private http = inject(HttpClient)

  getProject(val: number, project: string): Observable<any> {
    try {
      const apiUrl = `${environment.urlAzure}api/Project/?priority=${val}`;
     // alert(apiUrl)
      return this.http.get(apiUrl);
    } catch(error) {
      console.error("Error Get Project", error);
      return EMPTY; // Import EMPTY from 'rxjs'
    }
  }
}
