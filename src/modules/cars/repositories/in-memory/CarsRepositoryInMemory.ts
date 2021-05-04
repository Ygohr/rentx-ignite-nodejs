import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/entities/Car";
import { ICarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create({ name, description, daily_rate, license_plate, fine_amount, brand, category_id }: ICreateCarDTO): Promise<Car> {
    const car = new Car();
    Object.assign(car, {
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id
    });

    this.cars.push(car);
    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }

  async findAvailable(category_id?: string, brand?: string, name?: string): Promise<Car[]> {
    const carsAvailable = this.cars.filter((car) => car.available === true);

    if (!category_id && !brand && !name) {
      return carsAvailable;
    }

    if (category_id) {
      const filteredByCategoryId = carsAvailable.filter((car) => car.category_id === category_id);
      this.cars.push(...filteredByCategoryId);
    }

    if (brand) {
      const filteredByBrand = carsAvailable.filter((car) => car.brand === brand);
      this.cars.push(...filteredByBrand);
    }

    if (name) {
      const filteredByName = carsAvailable.filter((car) => car.name === name);
      this.cars.push(...filteredByName);
    }

    return this.cars;
  }
}

export { CarsRepositoryInMemory };
