import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Goal} from '../model/goal';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {DatePipe} from '@angular/common';
import * as echarts from '../../assets/echarts';
import {GoalDay} from '../model/goal-day-dto';
import {from} from 'rxjs';
import {groupBy, mergeMap, toArray} from 'rxjs/operators';
import {EnrichGoalStatus, FailureType, GoalStatus} from '../model/goal-status';
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
  public static statusToPercentageMapper: Map<GoalStatus, number> = new Map([
    [GoalStatus.COMPLETED, 100],
    [GoalStatus.EMERGENCY, 20],
    [GoalStatus.FAILED, -100],
    [GoalStatus.INACTIVE, 0],
    [GoalStatus.SKIPPED, 0],
    [GoalStatus.EMPTY, 0],
  ]);
  goalBarChart;

  token;
  selectedGoal;
  goalsStatusChart;
  goalsValues: GoalDay[] = [];
  goals: Goal[] = [];
  startDate = new FormControl((new Date()));
  endDate = new FormControl((new Date()));

  constructor(private dataService: DataService, private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.goalsValues = this.dummyGoalValues();
    this.createGoalsStatusChart();
    this.createGoalBarChart(
      this.dummyGoalValues().map(goal => goal.date),
      this.dummyGoalValues().map(goal => GoalsGraphsComponent.statusToPercentageMapper.get(goal.selection.value))
    );
  }

  click() {
    this.dataService.fetchGoalHistory(
      this.token,
      this.selectedGoal,
      this.datePipe.transform(this.startDate.value, 'yyyy-MM-dd'),
      this.datePipe.transform(this.endDate.value, 'yyyy-MM-dd'))
      .subscribe(data => {
        this.goalsValues = [];
        data.forEach(entry => {
          this.goalsValues.push(new GoalDay(
            entry.id,
            entry.date,
            new EnrichGoalStatus(entry.selection, entry.failure_type),
            entry.mode,
            entry.automatic
            )
          );
        });
        this.createGoalsStatusChart();
        this.createGoalBarChart(
          this.goalsValues.map(goal => goal.date),
          this.goalsValues.map(goal => GoalsGraphsComponent.statusToPercentageMapper.get(goal.selection.value))
        );
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

  updateBarChart(period: string) {
    switch (period) {
      case 'daily': {
        this.createGoalBarChart(
          this.goalsValues.map(goal => goal.date),
          this.goalsValues.map(goal => GoalsGraphsComponent.statusToPercentageMapper.get(goal.selection.value))
        );
        break;
      }
      case 'weekly': {
        this.createGoalBarChart(
          this.goalsValues
            .filter((goal, i) => i)
            .map(goal => goal.date),
          this.goalsValues.map(goal => GoalsGraphsComponent.statusToPercentageMapper.get(goal.selection.value))
        );
        break;
      }
    }
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
        data: EnrichGoalStatus.generateStatusValues()
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
      groupBy(goal => goal.selection.translated),
      mergeMap(group => group.pipe(toArray()))).subscribe(entry => {
      resultArray.push({value: entry.length, name: entry[0].selection.translated});
    });
    return resultArray;
  }

  private dummyGoalValues() {
    return [
      new GoalDay(
        '1',
        this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        new EnrichGoalStatus(GoalStatus.COMPLETED, undefined),
        'entry.mode',
        true
      ),
      new GoalDay(
        '2',
        this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() - 1)), 'yyyy-MM-dd'),
        new EnrichGoalStatus(GoalStatus.FAILED, FailureType.BAD_SITUATION),
        'entry.mode',
        true
      ),
      new GoalDay(
        '3',
        this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() - 2)), 'yyyy-MM-dd'),
        new EnrichGoalStatus(GoalStatus.FAILED, FailureType.FORGET),
        'entry.mode',
        true
      ),
      new GoalDay(
        '4',
        this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() - 3)), 'yyyy-MM-dd'),
        new EnrichGoalStatus(GoalStatus.EMERGENCY, undefined),
        'entry.mode',
        true
      ),
    ];
  }

  private createGoalBarChart(xValues, yValues) {
    this.goalBarChart = echarts.init(document.getElementById('goals-bar-chart'));

    const option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: xValues,
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Status',
          type: 'bar',
          barWidth: '60%',
          data: yValues,
        }
      ]
    };
    this.goalBarChart.setOption(option);
  }


}
