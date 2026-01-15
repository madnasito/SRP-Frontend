// To parse this data:
//
//   import { Convert, CourseWithLessons } from "./file";
//
//   const courseWithLessons = Convert.toCourseWithLessons(json);

export interface CourseWithLessons {
    id:          number;
    title:       string;
    description: string;
    imageUrl:    string;
    lessons:     Lesson[];
    active:      boolean;
}

export interface Lesson {
    id:       number;
    title:    string;
    content:  string;
    videoUrl: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toCourseWithLessons(json: string): CourseWithLessons {
        return JSON.parse(json);
    }

    public static courseWithLessonsToJson(value: CourseWithLessons): string {
        return JSON.stringify(value);
    }
}
