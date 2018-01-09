import {Task} from "../task/task.model";

export class DayTasks {


  constructor(public date: Date,
              public tasks: Task[]) {
  }
}
