import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GoalDayDto} from './model/goal-day-dto';

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
    return this.http.get<GoalDayDto[]>(`api/goals/${goalId}/days?from=${startDate}&to=${endDate}`, {headers});
  }

}
