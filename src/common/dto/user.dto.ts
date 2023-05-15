export interface CreateUserDto {
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    secondName?: string;
    firstSurname: string;
    secondSurname?: string;
    userName: string;
    address: string;
    birthDate: Date;
    city: string;
    roleId: number;
    genderId: number;
    countryId: number;
    userStateId: number;
}