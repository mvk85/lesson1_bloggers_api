import { Request, Response, Router } from "express";
import { testingService } from "../domain/testing.service";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
    await testingService.deleteAllData();

    res.sendStatus(204)
})