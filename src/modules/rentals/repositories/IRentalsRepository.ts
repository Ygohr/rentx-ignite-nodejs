import { ICreateRentalDTO } from "../dtos/ICreateRentalDTO";
import { Rental } from "../entities/Rental";

interface IRentalsRepository {
  findOpenRentalByCarId(car_id: string): Promise<Rental>;
  findOpenRentalByUserId(user_id: string): Promise<Rental>;
  create({ car_id, user_id, expected_return_date }: ICreateRentalDTO): Promise<Rental>;
  findById(rental_id: string): Promise<Rental>;
  update(rental_id: string, end_date: Date, total: number): Promise<void>;
  findRentalsByUser(user_id: string): Promise<Rental[]>;
}

export { IRentalsRepository };
