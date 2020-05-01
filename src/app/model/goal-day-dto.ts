import {EnrichGoalStatus, FailureType, GoalStatus} from './goal-status';

export class GoalDayDto {
  id: string;
  date: string;
  selection: GoalStatus;
  // tslint:disable-next-line:variable-name
  failure_type: FailureType;
  mode: string;
  automatic: boolean;


}

export class GoalDay {
  id: string;
  date: string;
  selection: EnrichGoalStatus;
  // tslint:disable-next-line:variable-name
  mode: string;
  automatic: boolean;

  constructor(id: string, date: string, selection: EnrichGoalStatus, mode: string, automatic: boolean) {
    this.id = id;
    this.date = date;
    this.selection = selection;
    this.mode = mode;
    this.automatic = automatic;
  }
}


