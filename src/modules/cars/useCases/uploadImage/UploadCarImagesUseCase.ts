import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImageRepository";
import { deleteFile } from "@utils/file";
import { inject, injectable } from "tsyringe";

interface IRequest {
  car_id: string;
  images_name: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject("CarsImagesRepository")
    private carsImagesRepository: ICarsImagesRepository
  ) {}
  async execute({ car_id, images_name }: IRequest): Promise<void> {
    const carHasImages = await this.carsImagesRepository.findCarImagesById(car_id);

    if (carHasImages.images.length > 0) {
      for (let image of carHasImages.images) {
        await deleteFile(`./tmp/cars/${image}`);
      }
    }

    images_name.map(async (image) => {
      await this.carsImagesRepository.create(car_id, image);
    });
  }
}

export { UploadCarImagesUseCase };
