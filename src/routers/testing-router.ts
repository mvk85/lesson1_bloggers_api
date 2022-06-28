import { Request, Response, Router } from "express";
import { TestingService } from "../domain/testing.service";

export const testingRouter = Router();

class TestingController {
    testingService: TestingService

    constructor() {
        this.testingService = new TestingService()
    }

    async delete(req: Request, res: Response) {
        await this.testingService.deleteAllData();
    
        res.sendStatus(204)
    }
}

const testingController = new TestingController();

testingRouter.delete("/all-data", testingController.delete.bind(testingController))