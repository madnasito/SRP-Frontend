// To parse this data:
//
//   import { Convert, ContactMessageResponse } from "./file";
//
//   const contactMessageResponse = Convert.toContactMessageResponse(json);

export interface ContactMessageResponse {
    data: Message[];
    meta: Meta;
}

export interface Message {
    id:      number;
    content: string;
    email:   string;
    date:    Date;
}

export interface Meta {
    total:    number;
    page:     number;
    lastPage: number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toContactMessageResponse(json: string): ContactMessageResponse {
        return JSON.parse(json);
    }

    public static contactMessageResponseToJson(value: ContactMessageResponse): string {
        return JSON.stringify(value);
    }
}
