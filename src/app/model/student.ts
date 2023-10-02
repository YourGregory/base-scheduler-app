export class Student {
  id: number;
  firstName: string;
  lastName: string;
  link: string;
  color: string;

  constructor(id: number, firstName: string, lastName: string, link: string, color: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.link = link;
    this.color = color;
  }
}
