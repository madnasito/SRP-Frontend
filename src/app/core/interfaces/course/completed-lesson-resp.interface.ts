export interface CompletedLessonResponse {
    id:          number;
    completed:   boolean;
    completedAt: Date;
}

export class Convert {
    public static toCompletedLessonResponse(json: string): CompletedLessonResponse {
        return JSON.parse(json);
    }

    public static completedLessonResponseToJson(value: CompletedLessonResponse): string {
        return JSON.stringify(value);
    }
}
