import { ONG } from "@app/entity/ongs.entity";
import { faker } from '@faker-js/faker';

export class OngMock {
  private readonly generateOng = () => {
    const ong = new ONG();

    ong.name = faker.company.name();

    return ong;
  }
  get listOfOngs() {
    return [
      this.generateOng(),
      this.generateOng(),
      this.generateOng(),
      this.generateOng(),
      this.generateOng(),
      this.generateOng(),
      this.generateOng(),
    ]
  }

  get ong() {
    return this.generateOng();
  }
}

export const ongMock = new OngMock();