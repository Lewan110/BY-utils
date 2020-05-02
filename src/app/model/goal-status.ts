export enum GoalStatus {
  EMERGENCY = 'EMERGENCY',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  INACTIVE = 'INACTIVE',
  SKIPPED = 'SKIPPED',
  EMPTY = 'EMPTY'
}

export enum FailureType {
  HARD_CIRCUMSTANCES = 'HARD_CIRCUMSTANCES',
  BAD_SITUATION = 'BAD_SITUATION',
  FORGET = 'FORGET',
  CONSCIOUS_FAILURE = 'CONSCIOUS_FAILURE',
  UNEXPECTED_EVENT = 'UNEXPECTED_EVENT',
}

export class EnrichGoalStatus {

  public static translatedStatus: Map<GoalStatus, string> = new Map([
    [GoalStatus.COMPLETED, 'WYKONANE'],
    [GoalStatus.EMERGENCY, 'AWARYJNE'],
    [GoalStatus.FAILED, 'PORAŻKA'],
    [GoalStatus.INACTIVE, 'NIE OBOWIĄZUJE'],
    [GoalStatus.SKIPPED, 'POMINIĘTE'],
    [GoalStatus.EMPTY, 'NIE ZAZNACZONE'],
  ]);
  public static translatedFailureType: Map<FailureType, string> = new Map([
    [FailureType.HARD_CIRCUMSTANCES, 'TRUDNE OKOLICZNOŚCI'],
    [FailureType.UNEXPECTED_EVENT, 'NIESPODZIEWANA SYTUACJA'],
    [FailureType.BAD_SITUATION, 'ZŁA SYTUACJA'],
    [FailureType.FORGET, 'ZAPOMNIENIE'],
    [FailureType.CONSCIOUS_FAILURE, 'ZAPLANOWANE'],
  ]);
  value: GoalStatus;
  failureReason: FailureType;
  translated: string;

  constructor(value: GoalStatus, failureType: FailureType) {
    this.value = value;
    this.translated = EnrichGoalStatus.translatedStatus.get(value);
    if (failureType !== undefined) {
      this.failureReason = failureType;
      this.translated = EnrichGoalStatus.generateFailureReason(failureType);
    }
  }

  public static generateStatusValues(): string[] {
    const values = [];
    for (const key of EnrichGoalStatus.translatedFailureType.keys()) {
      values.push(EnrichGoalStatus.generateFailureReason(key));
    }
    return values.concat(Array.from(EnrichGoalStatus.translatedStatus.values()));
  }

  private static generateFailureReason(failureType: FailureType): string {
    return EnrichGoalStatus.translatedStatus.get(GoalStatus.FAILED) + ' - ' + EnrichGoalStatus.translatedFailureType.get(failureType);
  }
}
