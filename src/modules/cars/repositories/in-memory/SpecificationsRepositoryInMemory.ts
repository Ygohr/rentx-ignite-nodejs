import { Specification } from "@modules/cars/entities/Specifications";
import { ICreateSpecificationDTO, ISpecificationsRepository } from "../ISpecificationsRepository";

class SpecificationsRepositoryInMemory implements ISpecificationsRepository {
  specifications: Specification[] = [];

  async create({ name, description }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = new Specification();
    Object.assign(specification, {
      name,
      description
    });
    this.specifications.push(specification);
    return specification;
  }

  async findByName(name: string): Promise<Specification> {
    const specification = this.specifications.find((specification) => specification.name === name);
    return specification;
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    const specifications = this.specifications.filter((specification) => ids.includes(specification.id));
    return specifications;
  }
}

export { SpecificationsRepositoryInMemory };
