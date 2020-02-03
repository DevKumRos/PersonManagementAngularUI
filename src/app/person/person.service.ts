import { Injectable } from '@angular/core';
import { IPerson } from './IPerson';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class PersonService {
    baseUrl = 'http://localhost:9091/personData';
    constructor(private httpClient: HttpClient) {
    }

    getPersons(): Observable<IPerson[]> {
        return this.httpClient.get<IPerson[]>(this.baseUrl+'/getAllPerson')
            .pipe(catchError(this.handleError));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        
            if (errorResponse.error instanceof ErrorEvent) {
                console.error('Client Side Error :', errorResponse.error.message);
            } else {
                console.error('Server Side Error :', errorResponse);
            }
            return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
      
    }

    getPerson(id: number): Observable<IPerson> {
        var url = this.baseUrl+'/getPersonById/'+id
        return this.httpClient.get<IPerson>(url)
            .pipe(catchError(this.handleError));
    }

    addPerson(person): Observable<string> {
        return this.httpClient.post<string>(this.baseUrl+'/createPerson', person, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
        .pipe(catchError(this.handleError));
    }

    updatePerson(person): Observable<string> {
        var url = this.baseUrl+'/updatePerson';
        return this.httpClient.put<string>(url, person, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.handleError));
    }

    deletePerson(id: number): Observable<void> {
        var url = this.baseUrl+'/deletePersonById/'+id
        console.log("Url : "+url);
        return this.httpClient.delete<void>(url)
            .pipe(catchError(this.handleError));
    }
}