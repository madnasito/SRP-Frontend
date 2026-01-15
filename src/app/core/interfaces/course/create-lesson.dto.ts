export interface CreateLessonDto {
    course:   number;
    title:    string;
    content:  string;
    videoUrl: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toCreateLessonDto(json: string): CreateLessonDto {
        return JSON.parse(json);
    }

    public static createLessonDtoToJson(value: CreateLessonDto): string {
        return JSON.stringify(value);
    }
}
