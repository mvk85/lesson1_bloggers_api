import { Request, Response } from "express";
import { injectable } from "inversify";
import { TestingService } from "../domain/testing.service";


@injectable()
export class TestingController {
    constructor(
        protected testingService: TestingService
    ) { }

    async delete(req: Request, res: Response) {
        await this.testingService.deleteAllData();

        res.sendStatus(204);
    }
}
