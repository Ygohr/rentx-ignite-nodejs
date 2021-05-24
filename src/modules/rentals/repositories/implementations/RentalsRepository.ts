import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/entities/Rental";
import { getRepository, Repository } from "typeorm";
import { IRentalsRepository } from "../IRentalsRepository";

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async findOpenRentalByCarId(car_id: string): Promise<Rental> {
    const rentalsQuery = this.repository.createQueryBuilder("rental").where("end_date is null");

    rentalsQuery.andWhere("rental.car_id = :car_id", { car_id });
    const carWithOpenRental = await rentalsQuery.getOne();

    return carWithOpenRental;
  }

  async findOpenRentalByUserId(user_id: string): Promise<Rental> {
    const rentalsQuery = this.repository.createQueryBuilder("rental").where("end_date is null");

    rentalsQuery.andWhere("rental.user_id = :user_id", { user_id });
    const userWithOpenRental = await rentalsQuery.getOne();
    return userWithOpenRental;
  }

  async create({ car_id, user_id, expected_return_date }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      car_id,
      user_id,
      expected_return_date
    });

    await this.repository.save(rental);

    return rental;
  }
}

export { RentalsRepository };
