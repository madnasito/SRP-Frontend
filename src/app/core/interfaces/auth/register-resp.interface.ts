import { UserDto } from "../user/user.dto";

export interface RegisterResp {
    user:  UserDto;
    token: string;
}
// Converts JSON strings to/from your types
export class Convert {
    public static toRegisterResp(json: string): RegisterResp {
        return JSON.parse(json);
    }

    public static registerRespToJson(value: RegisterResp): string {
        return JSON.stringify(value);
    }
}
