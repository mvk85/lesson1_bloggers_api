import { Request, Response, Router } from "express";
import { testingService } from "../domain/testing.service";

export const testingRouter = Router();

class TestingController {
    async delete(req: Request, res: Response) {
        await testingService.deleteAllData();
    
        res.sendStatus(204)
    }
}

const testingController = new TestingController();

testingRouter.delete("/all-data", testingController.delete)