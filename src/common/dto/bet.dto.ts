import { BetStateEnum } from "../utils/state.enum";

export interface BetDto {
    amount: number;
    betId: number;
    executed?: boolean;
}

export interface BetUpdateDto {
    betId: number;
    newState: BetStateEnum;
}