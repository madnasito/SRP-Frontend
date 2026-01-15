// To parse this data:
//
//   import { Convert, CreateContactMessageDto } from "./file";
//
//   const createContactMessageDto = Convert.toCreateContactMessageDto(json);

export interface CreateContactMessageDto {
    email:   string;
    content: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toCreateContactMessageDto(json: string): CreateContactMessageDto {
        return JSON.parse(json);
    }

    public static createContactMessageDtoToJson(value: CreateContactMessageDto): string {
        return JSON.stringify(value);
    }
}
