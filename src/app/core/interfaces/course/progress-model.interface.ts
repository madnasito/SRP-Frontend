// To parse this data:
//
//   import { Convert, ProgressModel } from "./file";
//
//   const progressModel = Convert.toProgressModel(json);

export interface ProgressModel {
    course:           Course;
    percent:          number;
    completedLessons: number;
    totalLessons:     number;
}

export interface Course {
    id:          number;
    title:       string;
    description: string;
    imageUrl:    string;
    active:      boolean;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toProgressModel(json: string): ProgressModel {
        return JSON.parse(json);
    }

    public static progressModelToJson(value: ProgressModel): string {
        return JSON.stringify(value);
    }
}
