import { CategoriesRepository } from "../../repositories/implementations/CategoriesRepository";
import { ImportCategoryController } from "./ImportCategoryController";
import { ImportCategoryUseCase } from "./ImportCategoryUseCase";

const categoriesRepository = CategoriesRepository.getInstance();
const importCategoryuseCase = new ImportCategoryUseCase(categoriesRepository);
const importCategoryController = new ImportCategoryController(importCategoryuseCase);

export { importCategoryController };
