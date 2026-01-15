// To parse this data:
//
//   import { Convert, ContactMessageResponse } from "./file";
//
//   const contactMessageResponse = Convert.toContactMessageResponse(json);

export interface ContactMessageResponse {
    id:      number;
    content: string;
    email:   string;
    date:    Date;
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
