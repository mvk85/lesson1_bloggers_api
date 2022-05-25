import bcrypt from 'bcrypt';

export const authService = {
    async generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)

        return hash;
    }
}