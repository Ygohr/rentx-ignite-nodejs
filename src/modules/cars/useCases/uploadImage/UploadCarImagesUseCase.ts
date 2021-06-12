import { FoldersName } from "@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarUseCase";
import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImageRepository";
import { IStorage } from "@shared/lib/Storage/IStorage";
import { inject, injectable } from "tsyringe";

interface IRequest {
  car_id: string;
  images_name: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject("CarsImagesRepository")
    private carsImagesRepository: ICarsImagesRepository,
    @inject("Storage")
    private storage: IStorage
  ) {}
  async execute({ car_id, images_name }: IRequest): Promise<void> {
    const carHasImages = await this.carsImagesRepository.findCarImagesById(car_id);

    if (carHasImages.images.length > 0) {
      for (let image of carHasImages.images) {
        await this.storage.delete(image, FoldersName.Cars);
      }
    }

    images_name.map(async (image) => {
      await this.carsImagesRepository.create(car_id, image);
      await this.storage.save(image, FoldersName.Cars);
    });
  }
}

export { UploadCarImagesUseCase };
