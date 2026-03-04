export interface Task {
  id: number;
  title: string;
  description: string;
  // 1: 进行中 2: 已完成 3: 已暂停 4: 已过期
  status: number;
  createTime: string;
}

export interface TaskProps {
  items?: Task[];
}

export interface CardTaskStatus {
  text: string;
  status: number;
  color: string;
  textColor?: string;
}

export interface CardTaskGroupProps extends CardTaskStatus {
  items: Task[];
}

export interface CardTaskItemProps {
  item: Task;
}
