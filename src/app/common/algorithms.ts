import { DropDownEntry } from "./types";

export function convertKeysToStringArray(T: any): string[] {
    const result = [];
    for (const enumValue in T){
        if (isNaN(parseInt(enumValue))){
            result.push(enumValue);
        }
    }
    return result;
}

export function getKeyNamesFromDropDownEntryList(arg: DropDownEntry[]){
    return arg.map((el:DropDownEntry)=>{
        return el.name;
    });
}

export function canEditDefaultCallback(arg:any): boolean {
    // TODO
    // get the user's id.
    // no if roleId %2 ==1
    // yes if site admin/owner
    // yes if item owner.
    // yes if item belongs to student the user is a teacher or admin of.
    // yes if item belongs to teacher of cohort the user is admin of.
    // no by default
    return true;
}
export function canDeleteDefaultCallback(arg:any): boolean {
    // TODO
    // no if site roleId%2==1
    // yes if site admin or owner
    // yes if user owns item
    // no otherwise.
    return true;
}