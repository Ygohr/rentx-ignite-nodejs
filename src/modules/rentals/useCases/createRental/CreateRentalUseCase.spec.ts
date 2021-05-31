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
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Rental", () => {
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dateUtils = new DateUtils();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, dateUtils, carsRepositoryInMemory);
  });

  const datePlus48Hours = dayjs().add(2, "day").toDate();

  it("1) Should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car test",
      description: "Test",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 30,
      brand: "Fiat",
      category_id: "1234"
    });

    const rental = await createRentalUseCase.execute({
      user_id: "123",
      car_id: car.id,
      expected_return_date: datePlus48Hours
    });

    expect(rental).toBeDefined();
    expect(rental).toBeInstanceOf(Rental);
  });

  it("2) Should not be able to create a new rental if car is already rented", async () => {
    try {
      const car = await carsRepositoryInMemory.create({
        name: "Car test",
        description: "Test",
        daily_rate: 100,
        license_plate: "ABC-1234",
        fine_amount: 30,
        brand: "Fiat",
        category_id: "1234"
      });

      await createRentalUseCase.execute({
        user_id: "123",
        car_id: car.id,
        expected_return_date: datePlus48Hours
      });

      const second_rental = await createRentalUseCase.execute({
        user_id: "444",
        car_id: car.id,
        expected_return_date: datePlus48Hours
      });
      expect(second_rental).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Car is already rented!");
    }
  });

  it("3) Should not be able to create a new rental if user has a rental in progress", async () => {
    try {
      await rentalsRepositoryInMemory.create({
        user_id: "123",
        car_id: "789456",
        expected_return_date: datePlus48Hours
      });

      const second_rental = await createRentalUseCase.execute({
        user_id: "123",
        car_id: "456789",
        expected_return_date: datePlus48Hours
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
