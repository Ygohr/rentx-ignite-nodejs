import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "../ICarsRepository";
import { Car } from "../../entities/Car";

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];
  async create({ name, description, daily_rate, license_plate, fine_amount, brand, category_id, id }: ICreateCarDTO): Promise<Car> {
    const car = new Car();
    Object.assign(car, {
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      id
    });

    this.cars.push(car);
    return car;
  }
  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }
  async findAvailable(category_id?: string, brand?: string, name?: string): Promise<Car[]> {
    const carsAvailable = this.cars.filter((car) => car.available === true);
    const carsResult: Car[] = [];

    if (!category_id && !brand && !name) {
      return carsAvailable;
    }

    if (category_id) {
      const filteredByCategoryId = carsAvailable.filter((car) => car.category_id === category_id);
      carsResult.push(...filteredByCategoryId);
    }

    if (brand) {
      const filteredByBrand = carsAvailable.filter((car) => car.brand === brand);
      carsResult.push(...filteredByBrand);
    }

    if (name) {
      const filteredByName = carsAvailable.filter((car) => car.name === name);
      carsResult.push(...filteredByName);
    }

    return carsResult;
  }

  async findById(id: string): Promise<Car> {
    const car = this.cars.find((car) => car.id === id);
    return car;
  }

  async updateAvailableStatus(id: string, available: boolean): Promise<void> {
    const carIndex = this.cars.findIndex((car) => car.id === id);
    this.cars[carIndex].available = available;
  }
}

export { CarsRepositoryInMemory };
