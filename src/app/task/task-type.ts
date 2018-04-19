export enum TaskType {
  MEETING = "MEETING",
  VOTE = "VOTE",
  TODO = "TODO"
}

export function getCreateModalId(taskType: string) {
  switch(taskType) {
    case 'MEETING': return 'create-meeting-modal';
    case 'VOTE': return 'create-vote-modal';
    case 'TODO': return 'create-todo-modal';
    default: return '';
  }
}
