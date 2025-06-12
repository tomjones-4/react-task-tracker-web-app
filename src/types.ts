export interface List {
  id: number;
  name: string;
  color: string;
  taskIds: number[];
}

export interface Task {
  id: number;
  completed: boolean;
  title: string;
  description: string;
  listId: number;
  priority: number | null;
  dueDate: Date | null;
  startTime: Time | null;
  endTime: Time | null;
  tagIds: number[];
}

export interface Subtask {
  id: number;
  completed: boolean;
  title: string;
  taskId: number;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

export interface Time {
  hour: number;
  minute: number;
  ampm: string;
}
