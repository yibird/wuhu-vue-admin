export interface Project {
  id: number | string;
  avatar?: string;
  name?: string;
  describe?: string;
  master?: string;
  createAt?: string;
}

export interface Action {
  id: number | string;
  icon?: string;
  name?: string;
}

export interface Dynamic {
  id: number | string;
  avatar?: string;
  name?: string;
  describe?: string;
  createAt?: string;
}

export interface TeamItem {
  id: number | string;
  icon?: string;
  name?: string;
}
