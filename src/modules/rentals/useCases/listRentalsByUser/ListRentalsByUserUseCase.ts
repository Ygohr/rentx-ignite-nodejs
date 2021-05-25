import { Rental } from "@modules/rentals/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListRentalsByUserUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository
  ) {}
  async execute(user_id: string): Promise<Rental[]> {
    const rentals = this.rentalsRepository.findRentalsByUser(user_id);
    return rentals;
  }
}

export { ListRentalsByUserUseCase };
