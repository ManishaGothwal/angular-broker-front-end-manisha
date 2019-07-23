import { Address } from './address.model';

export class User {

  constructor(
    public id: string,
    public username: string,
    public password: string,
    public company_name: string,
    public company_address: Address,
    public machines: string[],
    public trucks: string[],
    public qualifications: string[],
    public role: string,
    public abilities: string[]
  ) {}

  updateUser (user : User) {
    this.abilities = user.abilities;
    this.company_address = user.company_address;
    this.company_name = user.company_name;
    this.machines = user.machines;
    this.trucks = user.trucks;
    this.password = user.password;
    this.qualifications = user.qualifications;
    this.role = user.role;
    this.username = user.username;
  }

}

