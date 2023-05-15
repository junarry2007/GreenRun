import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { DefaultResponseDto } from "../../common/dto/default.response.dto";
import { TransactionEntity } from "../../data/entities/transaction.entity";
import { ErrorCodes } from "../../common/utils/error.codes.enum";
import { TransactionTypeRepository } from "../../data/repository/transaction.type.repository";
import { OperationEnum } from "../../common/utils/operation.enum";
import { TransactionDto } from "../../common/dto/transaction.dto";
import { UserRepository } from "../../data/repository/user.respository";
import { UserEntity } from "../../data/entities/user.entity";
import { TransactionRepository } from "../../data/repository/transaction.repository";
import { TransactionsBalanceDto } from "../../common/dto/transactions.balance.dto";

export class TransactionController {

    async add(request: Request, result: ResponseToolkit): Promise<ResponseObject>{
        const dataResult: DefaultResponseDto<TransactionEntity | null> = {
            status: true,
            codeStatus: 'OK',
            data: null,
            message: 'OK'
        };

        try {
            const paramas: TransactionDto = request.payload as TransactionDto;
            let userData: UserEntity | null;
            if(paramas.userId){
                //-- Cuando el parametro es nulo quiere decir que la transaccion la hace un tercero
                //-- Cuando el parametro contiene un valor quiere decir que la transaccion la hizo el mismo usuario
                userData = await UserRepository.getById(paramas.userId);
            }else{
                userData = await UserRepository.getByFirebaseId(request.auth.credentials.firebaseId as string);
            }
            const transactionType = await TransactionTypeRepository.getById(paramas.transactionTypeId);
            let newAmount = 0;
            if(transactionType!.operation == OperationEnum.ADD){
                //-- Toma el valor que tenga el usuario en 'balance' y le suma el monto del deposito
                newAmount = userData!.balance + paramas.amount;
            }else{
                //-- Toma el valor que tenga el usuario en 'balance' y le resta el nuevo monto
                //-- Si el valor que tiene el usuario es mayor al monto de la transaccion no se puede completar la transaccion
                if(userData!.balance < paramas.amount){
                    dataResult.codeStatus = '0x0008';
                    dataResult.message = `Error: ${ErrorCodes["0x0008"]}`;
                    dataResult.status = false;
                    dataResult.data = null;
                    return result.response(dataResult).code(500);
                }
                newAmount = userData!.balance - paramas.amount;
            }

            //-- Inserta la transaccion
            const newTransacttion = await TransactionRepository.createTransaction(userData!, transactionType!, paramas.amount, userData!.balance, newAmount);
            dataResult.data = newTransacttion;

            //-- Actualiza el balance
            const executionUpdateBalance = await UserRepository.updateBalance(userData!.id, newAmount);
            if(!executionUpdateBalance){
                dataResult.codeStatus = '0x0007';
                dataResult.message = `Error: ${ErrorCodes["0x0007"]}`;
                dataResult.status = false;
                dataResult.data = null;
                return result.response(dataResult).code(500);
            }
            userData!.balance = newAmount;

            return result.response(dataResult);
        } catch(error: any) {
            dataResult.codeStatus = '0x0002';
            dataResult.message = `Error: ${ErrorCodes["0x0002"]} - ${error.message}`;
            dataResult.status = false;
            dataResult.data = null;
            return result.response(dataResult).code(500);
        }
    }

    async getUserTransactions(request: Request, result: ResponseToolkit): Promise<ResponseObject>{
        const dataResult: DefaultResponseDto<TransactionsBalanceDto | null> = {
            status: true,
            codeStatus: 'OK',
            data: null,
            message: 'OK'
        };
        try {
            const firebaseId: string = request.auth.credentials.firebaseId as string;
            //Se procede a validar que el usuario tenga el rol = 1 (Usuario)
            //NOTA: Esto se podria almacenar en una constaante ya que al moemnto de desplegar en otro ambiente o DB este id puede cambiar
            // y no esta bien que ese valor quede 'quemado', pero para el demo pues.... :P
            const validationResult = await UserRepository.validateRole(firebaseId, 1);
            if(validationResult && validationResult.hasRole === 1){
                const user = await UserRepository.getById(validationResult.userId);
                if(user){
                    const transactoins = await TransactionRepository.getByUser(user);
                    if(transactoins){
                        dataResult.data = {
                            balance: user.balance,
                            transactions: transactoins
                        };
                    }else{
                        dataResult.codeStatus = '0x0002';
                        dataResult.message = `Error: ${ErrorCodes["0x0002"]}`;
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
            dataResult.codeStatus = '0x0002';
            dataResult.message = `Error: ${ErrorCodes["0x0002"]} - ${error.message}`;
            dataResult.status = false;
            dataResult.data = null;
            return result.response(dataResult).code(500);
        }
    }

}