// To parse this data:
//
//   import { Convert, LoginDto } from "./file";
//
//   const loginDto = Convert.toLoginDto(json);

export interface LoginDto {
    email:    string;
    password: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toLoginDto(json: string): LoginDto {
        return JSON.parse(json);
    }

    public static loginDtoToJson(value: LoginDto): string {
        return JSON.stringify(value);
    }
}
