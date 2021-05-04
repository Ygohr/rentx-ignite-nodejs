import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
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

    const cars = await listAvailableCarsUseCase.execute({});
    expect(cars).toStrictEqual([car]);
  });
  it("2) Should be able to list all available cars by brand", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car test2",
      description: "Car test2 description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 20,
      brand: "Brand2",
      category_id: "category_id"
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: "Brand2"
    });

    expect(cars).toStrictEqual([car]);
  });
  it("3) Should be able to list all available cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car test3",
      description: "Car test2 description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 20,
      brand: "Brand2",
      category_id: "category_id"
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: "Car test3"
    });

    expect(cars).toStrictEqual([car]);
  });

  it("4) Should be able to list all available cars by category_id", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car test4",
      description: "Car test2 description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 20,
      brand: "Brand2",
      category_id: "category_id_test"
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "category_id_test"
    });

    expect(cars).toStrictEqual([car]);
  });
});
