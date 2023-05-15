import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { DefaultResponseDto } from "../../common/dto/default.response.dto";
import { UserBetsRepository } from "../../data/repository/user.bets.repository";
import { ErrorCodes } from "../../common/utils/error.codes.enum";
import { BetsEntity } from "../../data/entities/bets.entity";
import { UserRepository } from "../../data/repository/user.respository";
import { BetUpdateDto } from "../../common/dto/bet.dto";
import { BetStateEnum, UserBetsStateEnum } from "../../common/utils/state.enum";

export class AdminController {

    async getBetsByEventIdOrSportId(request: Request, result: ResponseToolkit): Promise<ResponseObject>{
        const dataResult: DefaultResponseDto<BetsEntity[] | null> = {
            status: true,
            codeStatus: 'OK',
            data: null,
            message: 'OK'
        };
        try {
            const validationResult = await UserRepository.validateRole(request.auth.credentials.firebaseId as string, 2);
            if(validationResult && validationResult.hasRole === 1){
                const repoResult = await UserBetsRepository.getBetsByEventOrSport(request.params.eventId, request.params.sportId);
                dataResult.data = repoResult;
                return result.response(dataResult);
            }else{
                dataResult.codeStatus = '0x0001';
                dataResult.message = `Error: ${ErrorCodes["0x0001"]}`;
                dataResult.status = false;
                dataResult.data = null;
                return result.response(dataResult).code(401);
            }
        } catch(error: any) {
            dataResult.status = false;
            dataResult.data = null;
            dataResult.codeStatus = '0x0002';
            dataResult.message = `Error: ${ErrorCodes["0x0002"]} - ${error.message}`;
            return result.response(dataResult).code(500);
        }
    }

    async updateBetState(request: Request, result: ResponseToolkit): Promise<ResponseObject>{
        const dataResult: DefaultResponseDto<boolean> = {
            status: true,
            codeStatus: 'OK',
            data: true,
            message: 'OK'
        };
        try {
            const validationResult = await UserRepository.validateRole(request.auth.credentials.firebaseId as string, 2);
            if(validationResult && validationResult.hasRole === 1){
                let paramas: BetUpdateDto = request.payload as BetUpdateDto;
                const betData = await UserBetsRepository.getBetById(paramas.betId);
                if(betData){
                    switch(paramas.newState){
                        case BetStateEnum.ACTIVE: 
                            if(betData.state == BetStateEnum.CANCELLED){
                                await UserBetsRepository.updateBetState(paramas.betId, paramas.newState);
                                dataResult.status = true;
                                dataResult.message = `Bet updated - (State: ${BetStateEnum[betData.state]})`;
                            }else{
                                dataResult.status = false;
                                dataResult.data = false;
                                dataResult.codeStatus = '0x0002';
                                dataResult.message = `Error: ${ErrorCodes["0x0002"]} - Record cannot be modified (State: ${BetStateEnum[betData.state]})`;
                            }
                            break;

                        case BetStateEnum.CANCELLED: 
                            if(betData.state == BetStateEnum.ACTIVE){
                                await UserBetsRepository.updateBetState(paramas.betId, paramas.newState);
                                dataResult.status = true;
                                dataResult.message = `Bet updated - (State: ${BetStateEnum[betData.state]})`;
                            }else{
                                dataResult.status = false;
                                dataResult.data = false;
                                dataResult.codeStatus = '0x0002';
                                dataResult.message = `Error: ${ErrorCodes["0x0002"]} - The record already contains the value`;
                            }
                            break;

                        case BetStateEnum.SETTLED_LOST: 
                            console.log('----------------------------------------------------------');
                            console.log('BetStateEnum.SETTLED_LOST');
                            console.log('----------------------------------------------------------');
                            if(betData.state == BetStateEnum.ACTIVE){
                                await UserBetsRepository.updateAndSettlement(UserBetsStateEnum.LOST, betData.id, betData.odd);
                            }else{
                                dataResult.status = false;
                                dataResult.data = false;
                                dataResult.codeStatus = '0x0002';
                                dataResult.message = `Error: ${ErrorCodes["0x0002"]} - The record already contains the value`;
                            }
                            break;

                        case BetStateEnum.SETTLED_WON: 
                            console.log('----------------------------------------------------------');
                            console.log('BetStateEnum.SETTLED_WON');
                            console.log('----------------------------------------------------------');
                            if(betData.state == BetStateEnum.ACTIVE){
                                await UserBetsRepository.updateAndSettlement(UserBetsStateEnum.WON, betData.id, betData.odd);
                            }else{
                                dataResult.status = false;
                                dataResult.data = false;
                                dataResult.codeStatus = '0x0002';
                                dataResult.message = `Error: ${ErrorCodes["0x0002"]} - The record already contains the value`;
                            }
                            break;

                        default:
                            dataResult.status = false;
                            dataResult.data = false;
                            dataResult.codeStatus = '0x0002';
                            dataResult.message = `Error: ${ErrorCodes["0x0002"]} - Error in the validation of the state information`;
                            break;
                    }
                }else{
                    dataResult.status = false;
                    dataResult.data = false;
                    dataResult.codeStatus = '0x0002';
                    dataResult.message = `Error: ${ErrorCodes["0x0002"]} - The bet does not exist`;
                }
                
                // const repoResult = await UserBetsRepository.getBetsByEventOrSport(request.params.eventId, request.params.sportId);
                // dataResult.data = repoResult;
                return result.response(dataResult);
            }else{
                dataResult.codeStatus = '0x0001';
                dataResult.message = `Error: ${ErrorCodes["0x0001"]}`;
                dataResult.status = false;
                dataResult.data = false;
                return result.response(dataResult).code(401);
            }
        } catch(error: any) {
            dataResult.status = false;
            dataResult.data = false;
            dataResult.codeStatus = '0x0002';
            dataResult.message = `Error: ${ErrorCodes["0x0002"]} - ${error.message}`;
            return result.response(dataResult).code(500);
        }
    }

}