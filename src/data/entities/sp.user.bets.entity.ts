export interface SpUserBetsEntity {
    userId: number;
    userFirstName: string;
    userSecondName?: string;
    userFirstSurname: string;
    userSecondSurname?: string;
    userEmail: string;
    userBetsId: number;
    userBetsAmount: number;
    userBetsStateId: number;
    userBetsStateName: string;
    betId: number;
}