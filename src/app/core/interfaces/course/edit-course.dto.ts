// To parse this data:
//
//   import { Convert, EditCourseDto } from "./file";
//
//   const editCourseDto = Convert.toEditCourseDto(json);

export interface EditCourseDto {
    id:          number;
    title:       string;
    description: string;
    imageUrl?:   string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toEditCourseDto(json: string): EditCourseDto {
        return JSON.parse(json);
    }

    public static editCourseDtoToJson(value: EditCourseDto): string {
        return JSON.stringify(value);
    }
}
