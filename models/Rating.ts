export class Rating {
  constructor(
    public id: number,
    public score: number,   // could also use 1 | 2 | 3 | 4 | 5 if you want to enforce
    public comment: string,
    public createdAt: Date
  ) {}
}