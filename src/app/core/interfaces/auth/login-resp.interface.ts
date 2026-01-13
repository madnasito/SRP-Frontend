import { UserDto } from "../user/user.dto";

export interface LoginResp {
    user:  UserDto;
    token: string;
}
// Converts JSON strings to/from your types
export class Convert {
    public static toLoginResp(json: string): LoginResp {
        return JSON.parse(json);
    }

    public static loginRespToJson(value: LoginResp): string {
        return JSON.stringify(value);
    }
}
