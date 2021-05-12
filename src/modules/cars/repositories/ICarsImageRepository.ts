import { CarImage } from "../entities/CarImage";

export interface ICarImages {
  car_id: string;
  images: string[];
}

interface ICarsImagesRepository {
  create(car_id: string, image: string): Promise<CarImage>;
  findCarImagesById(car_id: string): Promise<ICarImages>;
}

export { ICarsImagesRepository };
