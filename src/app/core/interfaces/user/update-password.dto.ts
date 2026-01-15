// To parse this data:
//
//   import { Convert, UpdatePasswordDto } from "./file";
//
//   const updatePasswordDto = Convert.toUpdatePasswordDto(json);

export interface UpdatePasswordDto {
    password: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toUpdatePasswordDto(json: string): UpdatePasswordDto {
        return JSON.parse(json);
    }

    public static updatePasswordDtoToJson(value: UpdatePasswordDto): string {
        return JSON.stringify(value);
    }
}
