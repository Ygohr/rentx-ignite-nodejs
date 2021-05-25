import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/entities/Rental";
import dayjs from "dayjs";
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

  async findById(rental_id: string): Promise<Rental> {
    const rental = await this.repository.findOne(rental_id);
    return rental;
  }

  async update(rental_id: string, end_date: Date, total: number): Promise<void> {
    const updated_at = dayjs().toDate();
    await this.repository.createQueryBuilder().update(Rental).set({ end_date, total, updated_at }).where("id = :rental_id", { rental_id }).execute();
  }

  async findRentalsByUser(user_id: string): Promise<Rental[]> {
    const rentals = this.repository.find({ where: { user_id }, relations: ["car"], order: { start_date: "ASC" } });
    return rentals;
  }
}

export { RentalsRepository };
