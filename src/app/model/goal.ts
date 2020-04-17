export class Goal {
  id: string;
  name: string;
  creationTime: string;

  constructor(id: string, name: string, creationTime: string) {
    this.id = id;
    this.name = name;
    this.creationTime = creationTime;
  }
}
