import { Request, Response } from "express";
import { container } from "tsyringe";
import { DevolutionRentalUseCase } from "./DevolutionRentalUseCase";

class DevolutionRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { rental_id } = request.params;
    const devolutionRentalUseCase = container.resolve(DevolutionRentalUseCase);
    const devolutionRental = await devolutionRentalUseCase.execute(rental_id);

    return response.json(devolutionRental);
  }
}

export { DevolutionRentalController };
