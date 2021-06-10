import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { AppError } from "@shared/errors/appError";
import { inject, injectable } from "tsyringe";
import dayjs from "dayjs";
import { Rental } from "@modules/rentals/entities/Rental";
import { DiffUnit } from "@shared/lib/DateUtils/DateUtils";
import { IDateUtils } from "@shared/lib/DateUtils/IDateUtils";

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("DateUtils")
    private dateUtils: IDateUtils
  ) {}

  async execute(rental_id: string): Promise<Rental> {
    const minDailyRate = 1;

    const rental = await this.rentalsRepository.findById(rental_id);

    if (!rental) {
      throw new AppError("Rental does not exists!");
    }

    const car = await this.carsRepository.findById(rental.car_id);

    const currentDate = dayjs().toDate();
    const devolutionDelay = this.dateUtils.dateDiff(currentDate, DiffUnit.day, rental.expected_return_date);

    let dailyRate = this.dateUtils.dateDiff(rental.start_date, DiffUnit.day);

    if (dailyRate <= 0) dailyRate = minDailyRate;

    let totalRental = 0;

    if (devolutionDelay > 0) {
      const fineAmount = devolutionDelay * car.fine_amount;
      totalRental += fineAmount;
    }

    totalRental += dailyRate * car.daily_rate;

    rental.end_date = dayjs().toDate();
    rental.total = totalRental;

    await this.rentalsRepository.update(rental.id, rental.end_date, rental.total);
    await this.carsRepository.updateAvailableStatus(car.id, true);

    return rental;
  }
}

export { DevolutionRentalUseCase };
