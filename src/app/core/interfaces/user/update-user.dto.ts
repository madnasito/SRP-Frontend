// To parse this data:
//
//   import { Convert, UpdateUserDto } from "./file";
//
//   const updateUserDto = Convert.toUpdateUserDto(json);

export interface UpdateUserDto {
    email: string;
    name:  string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toUpdateUserDto(json: string): UpdateUserDto {
        return JSON.parse(json);
    }

    public static updateUserDtoToJson(value: UpdateUserDto): string {
        return JSON.stringify(value);
    }
}
