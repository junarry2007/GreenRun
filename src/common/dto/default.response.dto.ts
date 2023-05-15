export interface DefaultResponseDto<T> {
    status: boolean;
    codeStatus: string;
    message: string;
    data: T
}