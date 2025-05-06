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
  dueDate: Date | null;
  tagIds: number[];
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}
