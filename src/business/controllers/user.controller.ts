import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { ErrorCodes } from "../../common/utils/error.codes.enum";
import { DefaultResponseDto } from "../../common/dto/default.response.dto";
import { getAuth } from 'firebase-admin/auth';
import { CreateUserDto } from "../../common/dto/user.dto";
import { UserEntity } from "../../data/entities/user.entity";
import { UserRepository } from "../../data/repository/user.respository";
import { UserBetsRepository } from "../../data/repository/user.bets.repository";
import { SpUserBetsEntity } from "../../data/entities/sp.user.bets.entity";
import { BetDto } from "../../common/dto/bet.dto";
import { TransactionRepository } from "../../data/repository/transaction.repository";
import { TransactionTypeRepository } from "../../data/repository/transaction.type.repository";
import { BetStateEnum } from "../../common/utils/state.enum";

export class UserController {

    //-- Registro para los usuarios
    async createUser(request: Request, result: ResponseToolkit): Promise<ResponseObject>{
        /*
        TODO: 
            > 1: Control de errores en DB
            > 2: Control de guardado en DB por si ocurre un problema se elimine de Firebase
        */
        const dataResult: DefaultResponseDto<UserEntity | null> = {
            status: true,
            codeStatus: 'OK',
            data: null,
            message: 'OK'
        };
        try {
            let paramas: CreateUserDto = request.payload as CreateUserDto;
            const displayName = 
                paramas.firstName + 
                (paramas.secondName? ` ${paramas.secondName}` : '') +
                ` ${paramas.firstSurname}` + 
                (paramas.secondSurname? ` ${paramas.secondSurname}` : '');
            const newUser = await getAuth().createUser({
                email: paramas.email,
                emailVerified: false,
                phoneNumber: `+57${paramas.phoneNumber}`,
                password: paramas.password,
                displayName: displayName,
                disabled: false
            });
            const userData = await UserRepository.create(paramas, newUser.uid);
            dataResult.data = userData;
            return result.response(dataResult);
        } catch(error: any) {
            switch(error.code){
                case 'auth/missing-email':
                    dataResult.codeStatus = '0x0003';
                    dataResult.message = `Error: ${ErrorCodes["0x0003"]} - ${error.message}`;
                    break;
                case 'auth/missing-password':
                    dataResult.codeStatus = '0x0004';
                    dataResult.message = `Error: ${ErrorCodes["0x0004"]} - ${error.message}`;
                    break;
                case 'auth/email-already-in-use':
                    dataResult.codeStatus = '0x0005';
                    dataResult.message = `Error: ${ErrorCodes["0x0005"]} - ${error.message}`;
                    break;
                case 'auth/invalid-email':
                    dataResult.codeStatus = '0x0006';
                    dataResult.message = `Error: ${ErrorCodes["0x0006"]} - ${error.message}`;
                    break;
                default :
                    dataResult.codeStatus = '0x0002';
                    dataResult.message = `Error: ${ErrorCodes["0x0002"]} - ${error.message}`;
                    break;
            }
            dataResult.status = false;
            dataResult.data = null;
            return result.response(dataResult).code(500);
        }
    }

    //-- Obtiene las apuestas del usuario accediendo con el Id del usuario
    async getBets(request: Request, result: ResponseToolkit): Promise<ResponseObject>{
        const dataResult: DefaultResponseDto<SpUserBetsEntity[] | null> = {
            status: true,
            codeStatus: 'OK',
            data: null,
            message: 'OK'
        };
        try {
            const repoResult = await UserBetsRepository.getByUserId(request.params.id);
            dataResult.data = repoResult;
            return result.response(dataResult);
        } catch(error: any) {
            dataResult.status = false;
            dataResult.data = null;
            dataResult.codeStatus = '0x0002';
            dataResult.message = `Error: ${ErrorCodes["0x0002"]} - ${error.message}`;
            return result.response(dataResult).code(500);
        }
    }

    //-- Agrega una apuesta accediendo al usuario por medio del token
    async addBet(request: Request, result: ResponseToolkit): Promise<ResponseObject>{
        const dataResult: DefaultResponseDto<BetDto[] | null> = {
            status: true,
            codeStatus: 'OK',
            data: null,
            message: 'OK'
        };
        try {
            let paramas: BetDto[] = request.payload as BetDto[];
            const validationResult = await UserRepository.validateRole(request.auth.credentials.firebaseId as string, 1);
            if(validationResult && validationResult.hasRole === 1){
                const userData = await UserRepository.getById(validationResult.userId);
                if(userData){
                    let oldBalance: number = userData.balance;
                    let newBalance: number = 0;
                    const totalAmount = paramas.map(x => x.amount).reduce((a, b) => a + b);
                    if(userData.balance >= totalAmount){
                        for(const itemParam of paramas){
                            //-- Se valida el estado de la apuesta
                            const betData = await UserBetsRepository.getBetById(itemParam.betId);
                            console.log('>>>>>>>>>>>>> 1 => Consulta de la apuesta: ', betData);
                            console.log('------');
                            if(betData){
                                if(betData.state == BetStateEnum.ACTIVE){
                                    console.log('>>>>>>>>>>>>> 2 => Validacion de estado: ', betData.state);
                                    console.log('------');

                                    //-- Se agrega el registro en 'table.user_bets'
                                    itemParam.executed = await UserBetsRepository.addUserBet(validationResult.userId, itemParam.betId, itemParam.amount);
                                    console.log('>>>>>>>>>>>>> 3 => Se agrega el registro en [table.user_bets]: ', itemParam.executed);
                                    console.log('------');

                                    //-- Si falla el registro en 'table.user_bets' no se procede a registrar el resto de la informacion
                                    if(itemParam.executed == true){
                                        const transactionType = await TransactionTypeRepository.getById(3);
                                        console.log('>>>>>>>>>>>>> 4 => Se consulto el tipo de transaccion: ', transactionType);
                                        console.log('------');

                                        newBalance = oldBalance - itemParam.amount;
                                        console.log('>>>>>>>>>>>>> 5 => newBalance: ', newBalance);
                                        console.log('------');

                                        //-- Se agrega la transaccion
                                        await TransactionRepository.createTransaction(userData, transactionType!, itemParam.amount, oldBalance, newBalance, itemParam.betId);
                                        console.log('>>>>>>>>>>>>> 6 => Se agrego la transaccion');
                                        console.log('------');

                                        oldBalance = oldBalance - itemParam.amount;
                                        console.log('>>>>>>>>>>>>> 7 => oldBalance: ', oldBalance);
                                        console.log('------');

                                        //-- Actualiza el balance
                                        await UserRepository.updateBalance(userData.id, newBalance);
                                        console.log('>>>>>>>>>>>>> 8 => Actualiza el balance');
                                        console.log('------');
                                    }
                                }else{
                                    //-- El estado de la apuesta no permite agregar un nuevo registro
                                    itemParam.executed = false;
                                    console.log('>>>>>>>>>>>>> 9 => El estado de la apuesta no permite agregar un nuevo registro');
                                    console.log('------');
                                }
                            }else{
                                //-- "Esa tal apuesta no existe" XD
                                itemParam.executed = false;
                                console.log('>>>>>>>>>>>>> 10 => "Esa tal apuesta no existe" XD');
                                console.log('------');
                            }
                            console.log('----------------------------------------------------------------------------------------------------');
                            console.log('----------------------------------------------------------------------------------------------------');
                        }
                        dataResult.data = paramas;
                    }else{
                        dataResult.codeStatus = '0x0008';
                        dataResult.message = `Error: ${ErrorCodes["0x0008"]}`;
                        dataResult.status = false;
                        dataResult.data = null;
                        return result.response(dataResult).code(500);
                    }
                }else{
                    dataResult.codeStatus = '0x0001';
                    dataResult.message = `Error: ${ErrorCodes["0x0001"]}`;
                    dataResult.status = false;
                    dataResult.data = null;
                    return result.response(dataResult).code(401);
                }
            }else{
                dataResult.codeStatus = '0x0001';
                dataResult.message = `Error: ${ErrorCodes["0x0001"]}`;
                dataResult.status = false;
                dataResult.data = null;
                return result.response(dataResult).code(401);
            }
            return result.response(dataResult);
        } catch(error: any) {
            dataResult.status = false;
            dataResult.data = null;
            dataResult.codeStatus = '0x0002';
            dataResult.message = `Error: ${ErrorCodes["0x0002"]} - ${error.message}`;
            return result.response(dataResult).code(500);
        }
    }

}
