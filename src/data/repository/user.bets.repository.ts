import { BetStateEnum, UserBetsStateEnum } from "../../common/utils/state.enum";
import { AppDataSource } from "../data.source";
import { BetsEntity } from "../entities/bets.entity";
import { SpUserBetsEntity } from "../entities/sp.user.bets.entity";
import { TransactionEntity } from "../entities/transaction.entity";
import { TransactionTypeEntity } from "../entities/transaction.type.entity";
import { userBetsEntity } from "../entities/user.bets.entity";
import { UserEntity } from "../entities/user.entity";

export class UserBetsRepository {

    static async getBetById(betId: number): Promise<BetsEntity | null>{
        return AppDataSource.getRepository(BetsEntity).findOneBy({
            id: betId
        });
    }

    static async updateBetState(betId: number, state: BetStateEnum): Promise<boolean>{
        try {
            const betRepo = AppDataSource.getRepository(BetsEntity);
            await betRepo.update(betId, { state: state, updateAt: new Date() });
            return true;
        } catch(error: any) {
            return false;
        }
    }

    static async updateAndSettlement(state: UserBetsStateEnum, betId: number, odd: number): Promise<boolean>{
        try {
            const newBetState: BetStateEnum = (state == UserBetsStateEnum.WON? BetStateEnum.SETTLED_WON : BetStateEnum.SETTLED_LOST);
            await AppDataSource.transaction(async (transactionManager) => {
                //-- Actualiza la tabla 'bets' con el nuevo estado
                await transactionManager
                    .getRepository(BetsEntity)
                    .update(betId, { state: newBetState, updateAt: new Date() });

                //-- Actualiza la tabla 'user_bets' con el nuevo estado para los usuarios se esa apuesta
                const dataReturn: any[] | null = await transactionManager
                    .createQueryBuilder()
                    .update(userBetsEntity)
                    .set({
                        state: state,
                        updatedAt: new Date()
                    })
                    .where('bet_id = :bet_id', { bet_id: betId })
                    .andWhere('state = :state', { state: 2 })
                    .select('id, user_id, amount')
                    //.returning(['id','user_id','amount'])
                    //.output(['id','user_id','amount'])
                    .execute();

                // console.log('----------------------------------------------------------');
                // console.log('betId ==> ', betId);
                // console.log('----------------------------------------------------------');
                // console.log('state ==> ', state);
                // console.log('----------------------------------------------------------');
                // console.log('dataReturn ==> ', dataReturn);
                // console.log('----------------------------------------------------------');

                //-- Verifica que la apuesta sea ganada para los usuarios que hicieron esa apuesta para liquidar
                if(dataReturn && dataReturn.length > 0 && newBetState == BetStateEnum.SETTLED_WON){
                    const dataTransactionType = await transactionManager
                        .getRepository(TransactionTypeEntity)
                        .findOneBy({ id: 4 });

                    for(const itemUpdated of dataReturn){
                        const userData = await transactionManager
                            .getRepository(UserEntity)
                            .findOneBy({ id: itemUpdated.user_id });

                        const transactionRepo = transactionManager.getRepository(TransactionEntity);
                        const newTransaction: TransactionEntity = transactionRepo.create();
                        newTransaction.user = userData!;
                        newTransaction.transactionType = dataTransactionType!;
                        newTransaction.amount = ((itemUpdated.amount as number) * odd);
                        newTransaction.oldBalance = userData!.balance;
                        newTransaction.newBalance = (newTransaction.amount + newTransaction.oldBalance);
                        newTransaction.createdAt = new Date();
                        newTransaction.betId = betId;
                        transactionRepo.save(newTransaction);
                    }   
                }
            });
            return true;
        } catch (error: any) {
            console.log('----------------------------------------------------------');
            console.log('RESULT[error] ==> ', error);
            console.log('----------------------------------------------------------');
            return false;
        }
    }

    static async getByUserId(userId: number): Promise<SpUserBetsEntity[] | null> {
        try{
            const queryString: string = 'CALL green_run_db.get_user_bets(?)';
            const queryResult = await AppDataSource.manager.query<any[]>(queryString, [userId]);
            const dataReturn: SpUserBetsEntity[] = [];
            if(queryResult && queryResult[0] && queryResult[0].length > 0){
                queryResult[0].forEach((item: any) => {
                    let newItem: SpUserBetsEntity = {
                        userId: item.user_id,
                        userFirstName: item.user_first_name,
                        userSecondName: item.user_second_name,
                        userFirstSurname: item.user_first_surname,
                        userSecondSurname: item.user_second_surname,
                        userEmail: item.user_email,
                        userBetsId: item.user_bets_id,
                        userBetsAmount: item.user_bets_amount,
                        userBetsStateId: item.user_bets_state,
                        userBetsStateName: UserBetsStateEnum[item.user_bets_state],
                        betId: item.bet_id
                    };
                    dataReturn.push(newItem);
                });
            }
            return dataReturn;
        }catch(error: any){
            return null;
        }
    }

    static async addUserBet(userId: number, betId: number, amount: number): Promise<boolean>{
        try {
            const queryString: string = 'CALL green_run_db.add_user_bet(?, ? ,?)';
            await AppDataSource.manager.query<any[]>(queryString, [userId, betId, amount]);
            return true;
        } catch(error: any) {
            return false;
        }
    }

    static async getBetsByEventOrSport(eventId?: number, sportId?: number): Promise<BetsEntity[] | null>{
        try {
            let finalEventId: number | null;
            if(!eventId || eventId === undefined || eventId == 0){
                finalEventId = null;
            }else{ 
                finalEventId = eventId;
            }

            let finalSportId: number | null;
            if(!sportId || sportId === undefined || sportId == 0){
                finalSportId = null;
            }else{ 
                finalSportId = sportId;
            }

            const queryString: string = 'CALL green_run_db.get_bets(?, ?)';
            const queryResult = await AppDataSource.manager.query<any[]>(queryString, [finalEventId, finalSportId]);
            
            const dataReturn: BetsEntity[] = [];
            if(queryResult && queryResult[0] && queryResult[0].length > 0){
                queryResult[0].forEach((item: any) => {
                    let newItem: BetsEntity = {
                        id: item.id, 
                        description: item.description,
                        odd: item.odd,
                        eventId: item.event_id,
                        state: item.state,
                        createdAt: item.created_at,
                        updateAt: item.update_at
                    };
                    dataReturn.push(newItem);
                });
            }
            return dataReturn;
        } catch(error: any) {
            return null;
        }
    }

}