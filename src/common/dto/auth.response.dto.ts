export interface AuthResponseDto {
    isValid: boolean;
    credentials: AuthResponseCredentialsDto;
    artifacts: AuthResponseArtifactDto;
}

export interface AuthResponseCredentialsDto {
    firebaseId: string;
}

export interface AuthResponseArtifactDto {
    userName: string;
    phoneNumber?: string;
    email?: string;
}