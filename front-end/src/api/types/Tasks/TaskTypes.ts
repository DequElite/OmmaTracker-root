export interface TaskType{
    id:number;
    user_id:number;
    difficulty_level: 'easy' | 'medium' | 'hard';
    name:string;
    description:string;
    date_to_complete:Date;
    subtasksnumber:number;
    completedsubtasks:number;
}

export interface SubTaskType{
    id:number;
    task_id:number;
    text:string;
    is_completed:boolean;
}