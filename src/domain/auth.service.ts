import bcrypt from 'bcrypt';
import { EmailManager } from '../magangers/email-manager';
import { CreateUserFields } from '../types';
import { UsersService } from './users.service';

export class AuthService {
    usersService: UsersService

    emailManager: EmailManager

    constructor() {
        this.usersService = new UsersService();
        this.emailManager = new EmailManager();
    }

    async getUserByCredentials(login: string, password: string) {
        const user = await this.usersService.getUserByLogin(login)

        if (!user) return null;

        const resultCompare = await bcrypt.compare(password, user.passwordHash);

        return resultCompare ? user : null
    }

    async registration(createUserFields: CreateUserFields): Promise<boolean> {
        const createdUser = await this.usersService.makeRegisteredUser(createUserFields)

        if (!createdUser) return false;

        const user = await this.usersService.getUserById(createdUser.id)

        if (!user) return false;

        const isSended = await this.emailManager.sendRegistrationCode(user)

        return isSended;
    }

    async registrationConfirmation(code: string) {
        const user = await this.usersService.getUserByConfirmationCode(code)

        if (!user) return false;

        const savedIsConfirmed = await this.usersService.registrationConfirmed(user.id)

        return savedIsConfirmed;
    }

    async registrationEmailResending(email: string) {
        const user = await this.usersService.getUserByEmail(email)

        if (!user) return false;

        const isUpdatedConfirmationCode = this.usersService.updateConfirmationCode(user);

        if (!isUpdatedConfirmationCode) return false;

        const updatedUser = await this.usersService.getUserById(user.id)

        if (!updatedUser) return false;

        const isSended = await this.emailManager.sendRegistrationCode(updatedUser)

        return isSended;
    }
}
