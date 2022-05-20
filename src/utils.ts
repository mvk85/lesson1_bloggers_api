import { ObjectId } from "mongodb";

export function deleteObjectId<T extends { _id?: string | ObjectId}>(item: T): Omit<T, "_id"> {
    delete item._id
    
    return item
}

export function deleteObjectsId(items: object[]) {    
    return items.map(i => deleteObjectId(i));
}