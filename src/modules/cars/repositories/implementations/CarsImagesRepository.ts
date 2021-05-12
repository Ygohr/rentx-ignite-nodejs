import { CarImage } from "@modules/cars/entities/CarImage";
import { getRepository, Repository } from "typeorm";
import { ICarImages, ICarsImagesRepository } from "../ICarsImageRepository";

class CarsImagesRepository implements ICarsImagesRepository {
  private repository: Repository<CarImage>;

  constructor() {
    this.repository = getRepository(CarImage);
  }

  async create(car_id: string, image: string): Promise<CarImage> {
    const carImage = this.repository.create({
      car_id,
      image
    });

    await this.repository.save(carImage);

    return carImage;
  }

  async findCarImagesById(car_id: string): Promise<ICarImages> {
    const cars = await this.repository.find({ car_id });

    const carImages = cars.reduce(
      (acc, item) => {
        return {
          car_id: item.car_id,
          images: [...acc.images, item.image]
        };
      },
      { car_id, images: [] } as ICarImages
    );

    return carImages;
  }
}

export { CarsImagesRepository };
