import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Goal} from '../model/goal';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {DatePipe} from '@angular/common';
import * as echarts from '../../assets/echarts';
import {GoalDay} from '../model/goal-day';
import {from} from 'rxjs';
import {groupBy, mergeMap, toArray} from 'rxjs/operators';
import {GoalStatus} from '../model/goal-status';
import {ErrorStateMatcher} from '@angular/material/core';

export class TokenMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-goals-graphs',
  templateUrl: './goals-graphs.component.html',
  styleUrls: ['./goals-graphs.component.scss']
})
export class GoalsGraphsComponent implements OnInit {

  token;
  selectedGoal;
  goalsStatusChart;
  goals: Goal[] = [];
  startDate = new FormControl((new Date()));
  endDate = new FormControl((new Date()));
  goalsValues: GoalDay[] = [];

  constructor(private dataService: DataService, private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.createGoalsStatusChart();
  }

  click() {
    this.dataService.fetchGoalHistory(
      this.token,
      this.selectedGoal,
      this.datePipe.transform(this.startDate.value, 'yyyy-MM-dd'),
      this.datePipe.transform(this.endDate.value, 'yyyy-MM-dd'))
      .subscribe(data => {
        this.goalsValues = data;
        this.createGoalsStatusChart();
      });


  }

  fetchGoals(token) {
    this.token = token;

    this.dataService.fetchAllGoals(this.token).subscribe(data => {
      this.goals = [];
      data.forEach(goal =>
        this.goals.push(new Goal(
          goal.id,
          goal.name,
          goal.creation_time
        ))
      );
    });

  }


  private createGoalsStatusChart() {
    this.goalsStatusChart = echarts.init(document.getElementById('goals-status-chart'));
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: Object.values(GoalStatus)
      },
      series: [
        {
          name: 'STATUS',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '30',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: this.setGoalsChartValues(this.goalsValues)
        }
      ]
    };
    this.goalsStatusChart.setOption(option);
  }

  private setGoalsChartValues(goalsValues: GoalDay[]) {
    const resultArray = [];
    from(goalsValues).pipe(
      groupBy(goal => goal.selection),
      mergeMap(group => group.pipe(toArray()))).subscribe(entry => {
      resultArray.push({value: entry.length, name: entry[0].selection});
    });
    return resultArray;
  }
}
