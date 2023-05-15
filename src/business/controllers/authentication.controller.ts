import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ErrorCodes } from "../../common/utils/error.codes.enum";
import { DefaultResponseDto } from "../../common/dto/default.response.dto";

export class AuthenticationController {
    
    //-- Iniciar sesion para los usuario
    async signin(request: Request, result: ResponseToolkit): Promise<ResponseObject>{
        const dataResult: DefaultResponseDto<string> = {
            status: true,
            codeStatus: 'OK',
            data: '',
            message: 'OK'
        };
        try{
            let paramas: any = request.payload;
            const signInFirebase = await signInWithEmailAndPassword(getAuth(), paramas.email, paramas.password);
            dataResult.message = 'OK';
            dataResult.data = await signInFirebase.user.getIdToken();
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
            dataResult.data = '';
            return result.response(dataResult).code(500);
        }
    }
}