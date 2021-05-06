import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { AppError } from "@shared/errors/appError";
import { inject } from "tsyringe";

interface IRequest {
  car_id: string;
  specifications_id: string[];
}

class CreateCarSpecificationUseCase {
  constructor(
    // @inject("CarsRepositoyr")
    private carsRepository: ICarsRepository
  ) {}
  async execute({ car_id, specifications_id }: IRequest): Promise<void> {
    const carExists = this.carsRepository.findById(car_id);

    if (!carExists) {
      throw new AppError("Car does not exists!");
    }
  }
}

export { CreateCarSpecificationUseCase };
