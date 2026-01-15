export interface Course {
    id:          number;
    title:       string;
    description: string;
    imageUrl:    string;
    active:      boolean;
}

export class Convert {
    public static toCourse(json: string): Course {
        return JSON.parse(json);
    }

    public static courseToJson(value: Course): string {
        return JSON.stringify(value);
    }
}
