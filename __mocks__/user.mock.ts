import { User, UserStatus } from "@app/entity/user.entity";
import { faker } from '@faker-js/faker';

export class UserMock {
  private readonly generateUser = (status = UserStatus.Created) => {
    const user = new User();

    user.name = faker.name.firstName();
    user.email = faker.internet.email();
    user.status = status;

    return user;
  }
  get listOfUsers() {
    return [
      this.generateUser(),
      this.generateUser(),
      this.generateUser(),
      this.generateUser(),
      this.generateUser(),
      this.generateUser(),
      this.generateUser(),
    ]
  }

  get user() {
    return this.generateUser();
  }
}

export const userMock = new UserMock();