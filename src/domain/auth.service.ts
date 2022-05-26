import bcrypt from 'bcrypt';
import { usersRepository } from '../repository/users-repository';

export const authService = {
    async generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)

        return hash;
    },

    async getUserByCredentials(login: string, password: string) {
        const user = await usersRepository.getUserByLogin(login)

        if (!user) return null;

        const resultCompare = await bcrypt.compare(password, user.passwordHash);

        return resultCompare ? user : null
    }
}