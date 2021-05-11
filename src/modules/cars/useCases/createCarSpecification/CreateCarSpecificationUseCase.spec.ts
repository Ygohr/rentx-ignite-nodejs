import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/appError";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe("Create Car Specification", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(carsRepositoryInMemory, specificationsRepositoryInMemory);
  });

  it("1) Should be able to add a new specification to the car", async () => {
    const carTestData = {
      name: "Car example",
      description: "Description Example",
      daily_rate: 250,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand Example",
      category_id: "07952f42-d62e-4336-8840-aad20a24031f"
    };

    const specification = await specificationsRepositoryInMemory.create({
      description: "test",
      name: "test"
    });

    const specifications_id = [specification.id];

    const car = await carsRepositoryInMemory.create(carTestData);

    const specificationsCars = await createCarSpecificationUseCase.execute({ car_id: car.id, specifications_id });
    expect(specificationsCars).toHaveProperty("specifications");
    expect(specificationsCars.specifications.length).toEqual(1);
  });

  it("2) Should not be able to add a new specification to inexistent car", async () => {
    const car_id = "inexistent_car_id";
    const specifications_id = ["12345"];

    try {
      const result = await createCarSpecificationUseCase.execute({ car_id, specifications_id });
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Car does not exists!");
    }
  });
});
