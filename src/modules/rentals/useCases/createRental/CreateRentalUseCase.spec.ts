import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { Rental } from "@modules/rentals/entities/Rental";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { AppError } from "@shared/errors/appError";
import { DateUtils } from "@shared/lib/implementations/DateUtils";
import dayjs from "dayjs";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dateUtils: DateUtils;
let carsRepository: CarsRepositoryInMemory;

describe("Create Rental", () => {
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dateUtils = new DateUtils();
    carsRepository = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, dateUtils, carsRepository);
  });

  const datePlus24Hours = dayjs().add(1, "day").toDate();

  it("1) Should be able to create a new rental", async () => {
    const rental = await createRentalUseCase.execute({
      user_id: "123",
      car_id: "321",
      expected_return_date: datePlus24Hours
    });

    expect(rental).toBeDefined();
    expect(rental).toBeInstanceOf(Rental);
  });

  it("2) Should not be able to create a new rental if car is already rented", async () => {
    try {
      await createRentalUseCase.execute({
        user_id: "123",
        car_id: "321",
        expected_return_date: datePlus24Hours
      });

      const second_rental = await createRentalUseCase.execute({
        user_id: "444",
        car_id: "321",
        expected_return_date: datePlus24Hours
      });
      expect(second_rental).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Car is already rented!");
    }
  });

  it("3) Should not be able to create a new rental if user has a rental in progress", async () => {
    try {
      await createRentalUseCase.execute({
        user_id: "123",
        car_id: "321",
        expected_return_date: datePlus24Hours
      });

      const second_rental = await createRentalUseCase.execute({
        user_id: "123",
        car_id: "444",
        expected_return_date: datePlus24Hours
      });
      expect(second_rental).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("There is a rental in progress for user!");
    }
  });

  it("4) Should not be able to create a new rental if expected return date is lower than 24 hours", async () => {
    try {
      const rental = await createRentalUseCase.execute({
        user_id: "123",
        car_id: "321",
        expected_return_date: dayjs().toDate()
      });

      expect(rental).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Rental expected return date must be higher than 24 hours!");
    }
  });
});
