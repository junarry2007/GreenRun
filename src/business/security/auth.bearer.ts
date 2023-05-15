import { getAuth } from 'firebase-admin/auth';
import { AuthResponseDto } from "../../common/dto/auth.response.dto";

export class AuthBearer {
    async virify(token: string): Promise<AuthResponseDto>{
        const dataResult: AuthResponseDto = {
            isValid: false,
            artifacts: {
                email: '',
                phoneNumber: '',
                userName: ''
            },
            credentials: {
                firebaseId: ''
            }
        };
        try{
            const dataUser = await getAuth().verifyIdToken(token);

            dataResult.credentials.firebaseId = dataUser.uid;
            dataResult.artifacts.userName = dataUser.name;
            dataResult.artifacts.phoneNumber = dataUser.phone_number;
            dataResult.artifacts.email = dataUser.email;
            dataResult.isValid = true;
            return dataResult;
        }catch(error: any){
            dataResult.isValid = false;
            return dataResult;
        }
    }
}