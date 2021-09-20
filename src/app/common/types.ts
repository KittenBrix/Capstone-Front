export interface userPhone {
    id?: number,
    userId?: number,
    phone?: string,
    user?: string,
    typename?: string,
    usercase?: string,
}

export interface userEmail {
    id?: number,
    userId?: number,
    email?: string,
    typename?: string,
}

export interface userRole {
    id?: number,
    userid?: number,
    roleid?: number,
    cohortid?: string,
    rolename?: string
}

export enum userRoleEnum {
    'guest student' = 1,
    'student' = 2,
    'guest teacher' = 3,
    'teacher' = 4,
    'guest admin' = 5,
    'admin' = 6,
    'view owner' = 7,
    'owner' = 8
}

export interface DataChangeEvent {
    type: 'add' | 'delete' | 'edit';
    field?: string;
    content: any;
    index: number;
}

export interface DropDownEntry {
    name: string,
    options: string[]
}
