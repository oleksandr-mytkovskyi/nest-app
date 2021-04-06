export class Create {
    title: string;
    description: string;
  }

export class Updata {
    title: string;
    description: string;
    status: boolean;
}

export class List {
  title: string;
  description: string;
  id: number;
  status: boolean;
  userId: number;
}
