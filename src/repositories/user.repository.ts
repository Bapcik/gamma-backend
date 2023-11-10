import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { appDataSource } from '../config/dataSource';
import { SignInUserDto } from '../dto/signInUser.dto';
import { TokenRepository } from './token.repository';
import { SignUpUserDto } from '../dto/signUpUser.dto';
import { IUser, IUserTokenData } from '../interfaces/IUser.interface';
import { ApiError } from '../helpers/api-error';

export class UserRepository extends Repository<User> {
  private tokenRepository: TokenRepository;
  constructor() {
    super(User, appDataSource.createEntityManager());
    this.tokenRepository = new TokenRepository();
  }

  async singUp(signUpUserDto: SignUpUserDto) {
    const candidate = await this.emailOrPhoneSearchUser(signUpUserDto);
    if (candidate) return null;

    const userData = await this.create(signUpUserDto);
    await this.save(userData);

    const tokens = await this.generateAndSaveTokens(userData);
    return {
      ...tokens,
      ...userData,
    };
  }
  async signIn(signInUserDto: SignInUserDto) {
    const user = await this.emailOrPhoneSearchUser(signInUserDto);
    if (!user) return null;

    const isMatch = await user.comparePassword(signInUserDto.password);

    if (!isMatch) throw ApiError.BadRequest('Login or password is wrong');

    const tokens = await this.generateAndSaveTokens(user);
    return {
      ...tokens,
      ...user,
    };
  }

  async refresh(userData: IUser): Promise<IUserTokenData | null> {
    const user = await this.findOne({ where: { id: userData.id } });
    if (!user) return null;

    const tokens = await this.generateAndSaveTokens(userData);

    return {
      ...tokens,
      ...user,
    };
  }

  async signOut(refreshToken: string) {
    return await this.tokenRepository.removeToken(refreshToken);
  }

  private async generateAndSaveTokens(userData: IUser) {
    const tokens = await this.tokenRepository.generateTokens();
    await this.tokenRepository.saveToken(userData.id, tokens.refreshToken);
    return tokens;
  }

  private async emailOrPhoneSearchUser(dto: SignUpUserDto | SignInUserDto) {
    const { email, phone } = dto;
    return email ? await this.findOne({ where: { email } }) : await this.findOne({ where: { phone } });
  }
}
