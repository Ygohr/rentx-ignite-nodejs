import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { AppError } from "@shared/errors/appError";
import { DiffUnit } from "@shared/lib/implementations/DateUtils";
import { inject, injectable } from "tsyringe";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}
@injectable()
class CreateRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("DateUtils")
    private dateUtils: IDateUtils,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository
  ) {}

  async execute({ user_id, car_id, expected_return_date }: IRequest): Promise<Rental> {
    const minRentalHours = 24;
    const carIsRented = await this.rentalsRepository.findOpenRentalByCarId(car_id);

    if (carIsRented) {
      throw new AppError("Car is already rented!");
    }
    const userHasRental = await this.rentalsRepository.findOpenRentalByUserId(user_id);

    if (userHasRental) {
      throw new AppError("There is a rental in progress for user!");
    }

    const hoursDiff = this.dateUtils.dateDiff(expected_return_date, DiffUnit.hour);
    if (hoursDiff < minRentalHours) {
      throw new AppError("Rental expected return date must be higher than 24 hours!");
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date
    });

    await this.carsRepository.updateAvailableStatus(car_id, false);

    return rental;
  }
}

export { CreateRentalUseCase };
