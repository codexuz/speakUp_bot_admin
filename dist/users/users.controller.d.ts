import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity.js").User>;
    findAll(): Promise<import("./entities/user.entity.js").User[]>;
    findOne(id: string): Promise<import("./entities/user.entity.js").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity.js").User>;
    remove(id: string): Promise<void>;
}
