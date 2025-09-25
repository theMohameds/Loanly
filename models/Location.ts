export class Location {
  constructor(
    public latitude: number,
    public longitude: number
  ) {}

  toString(): string {
    return `${this.latitude},${this.longitude}`;
  }
}
