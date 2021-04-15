import { AppError } from "../../../../errors/appError";
import { CategoriesRepositoryInMemory } from "../../repositories/in-memory/CategoriesRepositoryInMemory";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe("Create Category", () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(categoriesRepositoryInMemory);
  });

  it("1) Should be able to create a new category", async () => {
    const category = {
      name: "Category Test",
      description: "Category Description Test"
    };
    await createCategoryUseCase.execute({
      name: category.name,
      description: category.description
    });

    const categoryCreated = await categoriesRepositoryInMemory.findByName(category.name);
    expect(categoryCreated).toBeDefined();
  });

  it("2) Should not be able to create a new category when it already exists", async () => {
    const category = {
      name: "Category Test",
      description: "Category Description Test"
    };

    try {
      await createCategoryUseCase.execute({
        name: category.name,
        description: category.description
      });

      const result = await createCategoryUseCase.execute({
        name: category.name,
        description: category.description
      });
      expect(result).not.toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toStrictEqual("Category already exists");
    }
  });
});
