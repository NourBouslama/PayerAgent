import { Injectable } from '@angular/core';
import {  HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agent } from '../model/agent.model';
import { AuthentificationService } from './authentification.service';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  apiURL: string = 'http://localhost:8080/caisses/agent';

  constructor(private http: HttpClient, private authService: AuthentificationService) { }


  modifierAgent(agent: Agent): Observable<Agent> {
 
   
    return this.http.put<Agent>(this.apiURL + '/modifierAgent', agent
    );
  }
}
