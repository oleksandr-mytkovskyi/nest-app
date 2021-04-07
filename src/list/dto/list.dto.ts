export class CreateDTO {
    title: string;
    description: string;
  }
export class CreateWithUserDTO {
  title: string;
  description: string;
  user: number;
}

export class UpdataDTO {
    title: string;
    description: string;
    status: boolean;
}

export class ListDTO {
  title: string;
  description: string;
  id: number;
  status: boolean;
}
