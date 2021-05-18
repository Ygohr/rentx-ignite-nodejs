import { Car } from "@modules/cars/entities/Car";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/appError";
import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("1) Should be able to create a new car", async () => {
    const car = {
      name: "Car example",
      description: "Description Example",
      daily_rate: 250,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand Example",
      category_id: "07952f42-d62e-4336-8840-aad20a24031f"
    };

    const result = await createCarUseCase.execute(car);
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Car);
  });

  it("2) Should not be able to create a new car when it already exists", async () => {
    try {
      const firstCar = {
        name: "Car first example",
        description: "Description Example",
        daily_rate: 250,
        license_plate: "ABC-1234",
        fine_amount: 60,
        brand: "Brand Example",
        category_id: "07952f42-d62e-4336-8840-aad20a24031f"
      };

      const secondCar = {
        name: "Car second example",
        description: "Description Example",
        daily_rate: 150,
        license_plate: "ABC-1234",
        fine_amount: 50,
        brand: "Brand Example",
        category_id: "07952f42-d62e-4336-8840-aad20a24031f"
      };

      await createCarUseCase.execute(firstCar);
      const result = await createCarUseCase.execute(secondCar);
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Car Already Exists");
    }
  });

  it("3) Should be able to verify if car is created with property available = true", async () => {
    const car = {
      name: "Car example",
      description: "Description Example",
      daily_rate: 250,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand Example",
      category_id: "07952f42-d62e-4336-8840-aad20a24031f"
    };

    const createdCar = await createCarUseCase.execute(car);
    expect(createdCar.available).toBeTruthy();
  });
});
