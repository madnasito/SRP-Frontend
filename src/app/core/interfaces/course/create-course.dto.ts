export interface CreateCourseDto {
    title:       string;
    description: string;
    image:       any;
}

export class Convert {
    public static toCreateCourseDto(json: string): CreateCourseDto {
        return JSON.parse(json);
    }

    public static createCourseDtoToJson(value: CreateCourseDto): string {
        return JSON.stringify(value);
    }
}
