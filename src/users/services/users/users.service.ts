import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import {
  CreateUserParam,
  CreateUserProfileParam,
  UpdateUserParam,
} from 'src/utils/types';
import { Repository } from 'typeorm';
import { Profile } from '../../../typeorm/entities/Profile';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  findUsers() {
    try {
      return this.userRepository.find({ relations: ['profile'] });
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

  async createUserProfile(
    id: number,
    CreateUserProfileDetails: CreateUserProfileParam,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(
        'User not found. Cannot create profile',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newProfile = this.profileRepository.create(CreateUserProfileDetails);
    const savedProfile = await this.profileRepository.save(newProfile);
    user.profile = savedProfile;
    return this.userRepository.save(user);
  }
}
