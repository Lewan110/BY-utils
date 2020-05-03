import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Goal} from '../model/goal';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {DatePipe} from '@angular/common';
import * as echarts from '../../assets/echarts';
import {GoalDay} from '../model/goal-day-dto';
import {from} from 'rxjs';
import {groupBy, map, mergeMap, toArray} from 'rxjs/operators';
import {EnrichGoalStatus, FailureType, GoalStatus} from '../model/goal-status';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {EditStatusValuesDialogComponent} from '../edit-status-values-dialog/edit-status-values-dialog.component';
import {ErrorMessageComponent} from '../error-message/error-message.component';

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
  public static statusToPercentageMapper: Map<string, number> = new Map([
    ['WYKONANE', 100],
    ['NIE OBOWIĄZUJE', 100],
    ['AWARYJNE', 50],
    ['POMINIĘTE', 0],
    ['NIE ZAZNACZONE', 0],
    ['PORAŻKA', -100],
    ['PORAŻKA - ZAPOMNIENIE', -100],
    ['PORAŻKA - ZAPLANOWANE', 0],
    ['PORAŻKA - ZŁA SYTUACJA', -50],
    ['PORAŻKA - TRUDNE OKOLICZNOŚCI', -50],
    ['PORAŻKA - NIESPODZIEWANA SYTUACJA', -30],
  ]);
  goalBarChart;
  token;
  selectedGoal;
  goalsStatusChart;
  goalsValues: GoalDay[] = this.dummyGoalValues();
  goals: Goal[] = [];
  startDate = new FormControl(new Date(new Date().setDate(new Date().getDate() - 1000)));
  endDate = new FormControl((new Date()));

  constructor(private dataService: DataService, private datePipe: DatePipe, private dialog: MatDialog,) {
  }

  ngOnInit(): void {
    this.createGoalsStatusChart();
    this.updateBarChart('weekly');
  }

  generateCharts() {
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
          this.updateBarChart('weekly');
        }, error => this.dialog.open(ErrorMessageComponent),
      )
    ;
  }

  updateBarChart(period: string) {
    switch (period) {
      case 'daily': {
        this.createGoalBarChart(
          this.goalsValues.map(goal => goal.date),
          this.goalsValues.map(goal => GoalsGraphsComponent.statusToPercentageMapper.get(goal.selection.translated))
        );
        break;
      }
      case 'weekly': {
        const values = this.calculateAvgPerPeriod(this.goalsValues, 'ww-yyyy');
        this.createGoalBarChart(
          values.map(value => value[0]),
          values.map(value => value[1])
        );
        break;
      }
      case 'monthly': {
        const values = this.calculateAvgPerPeriod(this.goalsValues, 'MM-yyyy');
        this.createGoalBarChart(
          values.map(value => value[0]),
          values.map(value => value[1])
        );
        break;
      }
      case 'yearly': {
        const values = this.calculateAvgPerPeriod(this.goalsValues, 'yyyy');
        this.createGoalBarChart(
          values.map(value => value[0]),
          values.map(value => value[1])
        );
        break;
      }
    }
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
    }, error => this.dialog.open(ErrorMessageComponent));

  }

  editStatusToValueMap() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(EditStatusValuesDialogComponent, {
      width: '30%',
      height: '50%',
      data: GoalsGraphsComponent.statusToPercentageMapper
    });
    dialogRef.afterClosed().subscribe(
      data => {
        GoalsGraphsComponent.statusToPercentageMapper = data;
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

  private calculateAvgPerPeriod(values: GoalDay[], period: string): any[] {
    const resultArray = [];
    from(values).pipe(
      groupBy(goal => this.datePipe.transform(goal.date, period)),
      mergeMap(group => group.pipe(toArray())),
      map(array => [
          this.datePipe.transform(array[0].date, period),
          array
            .map(day => GoalsGraphsComponent.statusToPercentageMapper.get(day.selection.translated))
            .reduce((prev, curr) => prev + curr, 1) / array.length
        ]
      ))
      .subscribe(entry => {
        resultArray.push(entry);
      });

    return resultArray;
  }

  private dummyGoalValues() {
    return [
      new GoalDay(
        '1',
        this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() - 100)), 'yyyy-MM-dd'),
        new EnrichGoalStatus(GoalStatus.COMPLETED, undefined),
        'entry.mode',
        true
      ),
      new GoalDay(
        '2',
        this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() - 80)), 'yyyy-MM-dd'),
        new EnrichGoalStatus(GoalStatus.FAILED, FailureType.BAD_SITUATION),
        'entry.mode',
        true
      ),
      new GoalDay(
        '3',
        this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() - 60)), 'yyyy-MM-dd'),
        new EnrichGoalStatus(GoalStatus.FAILED, FailureType.FORGET),
        'entry.mode',
        true
      ),
      new GoalDay(
        '4',
        this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() - 40)), 'yyyy-MM-dd'),
        new EnrichGoalStatus(GoalStatus.EMERGENCY, undefined),
        'entry.mode',
        true
      ),
      new GoalDay(
        '5',
        this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() - 20)), 'yyyy-MM-dd'),
        new EnrichGoalStatus(GoalStatus.SKIPPED, undefined),
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
      toolbox: {
        feature: {
          magicType: {show: true, type: ['line', 'bar']},
          saveAsImage: {show: true}
        }
      },
      legend: {
        data: ['Linia', 'Słupki']
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
          name: 'Słupki',
          type: 'bar',
          barWidth: '60%',
          data: yValues,
        },
        {
          color: 'red',
          lineStyle: {
            color: 'red',
            width: 5
          },
          name: 'Linia',
          type: 'line',
          data: yValues
        }
      ]
    };
    this.goalBarChart.setOption(option);
  }
}
