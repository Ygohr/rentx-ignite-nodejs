import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/entities/Rental";
import { IRentalsRepository } from "../IRentalsRepository";

class RentalsRepositoryInMemory implements IRentalsRepository {
  rentals: Rental[] = [];

  async findOpenRentalByCarId(car_id: string): Promise<Rental> {
    const carWithOpenRental = this.rentals.find((rental) => rental.car_id === car_id && !rental.end_date);

    return carWithOpenRental;
  }

  async findOpenRentalByUserId(user_id: string): Promise<Rental> {
    const userWithOpenRental = this.rentals.find((rental) => rental.user_id === user_id && !rental.end_date);

    return userWithOpenRental;
  }

  async create({ car_id, user_id, expected_return_date }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, {
      car_id,
      user_id,
      expected_return_date,
      created_at: new Date(),
      start_date: new Date()
    });

    this.rentals.push(rental);

    return rental;
  }
}

export { RentalsRepositoryInMemory };
