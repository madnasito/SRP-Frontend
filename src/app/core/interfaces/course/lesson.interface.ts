export interface Lesson {
    id:       number;
    title:    string;
    content:  string;
    videoUrl: string;
    course:   Course;
}

export interface Course {
    id: number;
}

export class Convert {
    public static toLesson(json: string): Lesson {
        return JSON.parse(json);
    }

    public static lessonToJson(value: Lesson): string {
        return JSON.stringify(value);
    }
}
