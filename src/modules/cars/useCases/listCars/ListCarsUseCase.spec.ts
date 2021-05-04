import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListCarsUseCase } from "./ListCarsUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listCarsUseCase: ListCarsUseCase;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listCarsUseCase = new ListCarsUseCase(carsRepositoryInMemory);
  });

  it("1) Should be able to list all available cars", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car test",
      description: "Car test description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 20,
      brand: "Brand1",
      category_id: "category_id"
    });

    const cars = await listCarsUseCase.execute({});
    expect(cars).toStrictEqual([car]);
  });

  it("2) Should be able to list all available cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car test2",
      description: "Car test2 description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 20,
      brand: "Brand2",
      category_id: "category_id"
    });

    const cars = await listCarsUseCase.execute({
      brand: "Brand2"
    });

    expect(cars).toStrictEqual([car]);
  });
});
