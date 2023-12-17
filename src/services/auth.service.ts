import { UsersRepository } from '../repositories/users.repository';
import { IUser, IUserEditAccount, IUserTokenData } from '../interfaces/IUser.interface';
import { AuthUserDto } from '../dto/authUser.dto';
import { EmailMessage } from '../interfaces/email/IEmailMessage';
import mailer from '../email/nodemailer';

export class AuthService {
  private repository: UsersRepository;

  constructor() {
    this.repository = new UsersRepository();
  }

  signUp = async (userDto: AuthUserDto) => {
    const user = await this.repository.signUp(userDto);
    if (user?.email) this.emailSendMessage(user.email);
    return user;
  };

  signIn = async (userDto: AuthUserDto) => {
    return await this.repository.signIn(userDto);
  };

  signOut = async (refreshToken: string) => {
    return await this.repository.signOut(refreshToken);
  };
  refresh = async (userData: IUserTokenData) => {
    return await this.repository.refresh(userData);
  };
  activateEmail = async (id: number) => {
    return await this.repository.activateEmail(id);
  };
  findOneUser = async (id: number): Promise<IUser | null> => {
    return await this.repository.findOneUser({ id });
  };

  checkPassword = async (id: number, сurrentPassword: string): Promise<IUser | null> => {
    return await this.repository.checkPassword(id, сurrentPassword);
  };

  findUserByEmail = async (email: string): Promise<IUser | null> => {
    return await this.repository.findUserByEmail(email);
  };

  findUserByPhone = async (phone: string): Promise<IUser | null> => {
    return await this.repository.findUserByPhone(phone);
  };

  editUser = async (
    user: IUser,
    userDto: Omit<IUserEditAccount, 'сurrentPassword'>,
  ): Promise<{ updatedUser: IUser | null; passwordUpdated: boolean }> => {
    const updatedUser = await this.repository.editUser(user, userDto);
    return updatedUser;
  };

  emailSendMessage = async (email: string) => {
    if (email) {
      const message = {
        to: email,
        subject: 'Подтверждение почты',
        html: `<h2>Вы зарегистрировались</h2>
          <i>Ваши данные:</i>
          <ul>
            <li>login: ${email}</li>
          </ul>
          <a href="http://localhost:8000/auth/activate/">Подтвердить почту</a>
        `,
      } as unknown as EmailMessage;
      mailer(message);
    }
  };
}
