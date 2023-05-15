import { AppDataSource } from "../data.source";
import { CreateUserDto } from "../../common/dto/user.dto";
import { CountryEntity } from "../entities/country.entity";
import { GenderEntity } from "../entities/genders.entity";
import { UserEntity } from "../entities/user.entity";
import { UserStateEntity } from "../entities/user.state.entity";
import { SpValidationRoleEntity } from "../entities/sp.validation.role.entity";

export class UserRepository {

    static async create(data: CreateUserDto, firebaseId: string): Promise<UserEntity | null>{
        
        const gender = await AppDataSource.getRepository(GenderEntity).findOneBy({ id: data.genderId });
        const country = await AppDataSource.getRepository(CountryEntity).findOneBy({ id: data.countryId });
        const userState = await AppDataSource.getRepository(UserStateEntity).findOneBy({ id: data.userStateId });

        const userRepo = AppDataSource.getRepository(UserEntity);
        const newUser: UserEntity = userRepo.create();
        newUser.firebaseId = firebaseId;
        newUser.gender = gender!;
        newUser.country = country!;
        newUser.userState = userState!;
        newUser.userName = data.userName;
        newUser.firstName = data.firstName;
        newUser.secondName = data.secondName;
        newUser.firstSurname = data.firstSurname;
        newUser.secondSurname = data.secondSurname;
        newUser.phone = `+57${data.phoneNumber}`;
        newUser.email = data.email;
        newUser.address = data.address;
        newUser.birthDate = data.birthDate;
        newUser.city = data.city;
        newUser.createdAt = new Date();
        const userCreated = await userRepo.save(newUser);

        //-- Lo hago de esta manera para no crear una entidad nueva
        await AppDataSource.manager.query(
            'INSERT INTO `green_run_db`.`user_roles` (`user_id`, `role_id`, `state`) VALUES (?, ?, ?)',
            [userCreated.id, data.roleId, 1]
        );
        
        return userCreated;
    }

    static getById(id: number): Promise<UserEntity | null>{
        return AppDataSource.getRepository(UserEntity).findOneBy({
            id: id
        });
    }

    static getByFirebaseId(firebaseId: string): Promise<UserEntity | null>{
        return AppDataSource.getRepository(UserEntity).findOneBy({
            firebaseId: firebaseId
        });
    }

    static async updateBalance(userId: number, amount: number): Promise<boolean>{
        try{
            const userRepo = AppDataSource.getRepository(UserEntity);
            await userRepo.update(userId, { balance: amount, updatedAt: new Date()});   
            return true;
        }catch(error: any){
            return false;
        }
    }

    static async validateRole(firebaseId: string, roleId: number): Promise<SpValidationRoleEntity | null>{
        try {
            const queryString: string = 'CALL green_run_db.validate_role_by_firebase_id(?, ?)';
            const queryResult = await AppDataSource.manager.query<any[]>(queryString, [firebaseId, roleId]);
            const dataReturn: SpValidationRoleEntity = {
                hasRole: queryResult[0][0].has_role,
                userId: queryResult[0][0].user_id
            };
            return dataReturn;
        } catch(error: any) {
            return null;
        }
    }

}