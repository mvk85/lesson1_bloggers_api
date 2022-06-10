import bcrypt from 'bcrypt';
import { emailManager } from '../magangers/email-manager';
import { usersRepository } from '../repository/users-repository';
import { CreateUserFields } from '../types';
import { usersService } from './users.service';

export const authService = {
    async generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)

        return hash;
    },

    async getUserByCredentials(login: string, password: string) {
        const user = await usersRepository.findUserByLogin(login)

        if (!user) return null;

        const resultCompare = await bcrypt.compare(password, user.passwordHash);

        return resultCompare ? user : null
    },

    async registration(createUserFields: CreateUserFields): Promise<boolean> {
        const createdUser = await usersService.makeRegisteredUser(createUserFields)

        if (!createdUser) return false;

        const user = await usersRepository.findUserByUserId(createdUser.id)

        if (!user) return false;

        const isSended = await emailManager.sendRegistrationCode(user)

        return isSended;
    },

    async registrationConfirmation(code: string) {
        const user = await usersRepository.findUserByConfirmationCode(code)

        if (!user) return false;

        const isConfirmed = await usersRepository.userConfirmed(user.id)

        if (isConfirmed) return true;

        const savedIsConfirmed = await usersRepository.registrationConfirmed(user.id)

        return savedIsConfirmed;
    },

    async registrationEmailResending(email: string) {
        const user = await usersRepository.findUserByEmail(email)

        if (!user) return false;

        const isUpdatedConfirmationCode = usersService.updateConfirmationCode(user);

        if (!isUpdatedConfirmationCode) return false;

        const updatedUser = await usersRepository.findUserByUserId(user.id)

        if (!updatedUser) return false;

        const isSended = await emailManager.sendRegistrationCode(updatedUser)

        return isSended;
    }
}