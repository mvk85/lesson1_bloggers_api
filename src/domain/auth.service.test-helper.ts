import { UsersModel } from "../repository/models.mongoose";
import { UsersRepository } from "../repository/users-repository";
import { CreateUserFields } from "../types";
import { UsersService } from "./users.service";

export default class TestHelper {
    public usersRepository: UsersRepository
    
    public usersService: UsersService

    constructor() {
        this.usersRepository = new UsersRepository(UsersModel)
        this.usersService = new UsersService(this.usersRepository);
    }

    public async makeRegistrationUser(login: string, password: string, email: string) {
        const fieldsForNewUser: CreateUserFields = { login, password, email }
    
        const newUser = await this.usersService.makeRegisteredUser(fieldsForNewUser)
    
        return newUser
    }
}