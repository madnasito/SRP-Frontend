// To parse this data:
//
//   import { Convert, UserDto } from "./file";
//
//   const userDto = Convert.toUserDto(json);

export interface UserDto {
    id:       number;
    name:     string;
    email:    string;
    password: string;
    admin:    boolean;
    active:   boolean;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toUserDto(json: string): UserDto {
        return JSON.parse(json);
    }

    public static userDtoToJson(value: UserDto): string {
        return JSON.stringify(value);
    }
}
