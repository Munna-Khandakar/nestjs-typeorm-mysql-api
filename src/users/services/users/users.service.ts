import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import {
  CreateUserParam,
  CreateUserProfileParam,
  UpdateUserParam,
} from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findUsers() {
    try {
      return this.userRepository.find();
    } catch (error) {
      return { error: true, message: 'something went wrong..!' };
    }
  }

  createUser(userDetails: CreateUserParam) {
    try {
      const newUser = this.userRepository.create({
        ...userDetails,
        createdAt: new Date(),
      });
      return this.userRepository.save(newUser);
    } catch (error) {
      // duplicate error asar kotha
      // ekhane error ase na
      return { error: true, message: 'something went wrong..!' };
    }
  }

  updateUser(id: number, userDetails: UpdateUserParam) {
    try {
      return this.userRepository.update({ id }, { ...userDetails });
    } catch (error) {
      return { error: true, message: 'something went wrong..!' };
    }
  }

  deleteUserById(id: number) {
    return this.userRepository.delete({ id });
  }

  createUserProfile(profileDetails: CreateUserProfileParam) {}
}
