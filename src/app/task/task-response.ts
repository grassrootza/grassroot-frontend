export class TaskResponse {
  constructor(public memberName: string,
              public response: string) {

  }
}

export const convertResponseMap = (map: Map<string, string>): TaskResponse[] => {
  return Object.keys(map).map(name => new TaskResponse(name, map[name]));
};
