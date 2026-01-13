// To parse this data:
//
//   import { Convert, RegisterDto } from "./file";
//
//   const registerDto = Convert.toRegisterDto(json);

export interface RegisterDto {
    name:     string;
    email:    string;
    password: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toRegisterDto(json: string): RegisterDto {
        return JSON.parse(json);
    }

    public static registerDtoToJson(value: RegisterDto): string {
        return JSON.stringify(value);
    }
}
