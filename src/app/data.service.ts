import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GoalDay} from './model/goal-day';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(private http: HttpClient) {
  }

  fetchAllGoals(token) {
    const headers = new HttpHeaders({
      Authorization: token
    });
    return this.http.get<any[]>('api/goals', {headers});
  }

  fetchGoalHistory(token, goalId, startDate, endDate) {
    const headers = new HttpHeaders({
      Authorization: token
    });
    return this.http.get<GoalDay[]>(`api/goals/${goalId}/days?from=${startDate}&to=${endDate}`, {headers});
  }

}
