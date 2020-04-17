import {GoalStatus} from './goal-status';

export class GoalDay {
  id: string;
  date: string;
  selection: GoalStatus;
  // tslint:disable-next-line:variable-name
  failure_type: string;
  mode: string;
  automatic: boolean;
}
