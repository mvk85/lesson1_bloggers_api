import { EmailEntity } from "../types";
import { emailCollection } from "./db";

export const emailsRepository = {
    async saveEmailEntity(emailEntity: EmailEntity) {
        try {
            await emailCollection.insertOne(emailEntity)

            return true
        } catch(_) {
            return false
        }
    }
}