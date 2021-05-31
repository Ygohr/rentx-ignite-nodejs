import { v4 as uuidV4 } from "uuid";
import { hash } from "bcrypt";
import { AppError } from "../errors/appError";
import createConnection from "../../database";

async function create() {
  const connection = await createConnection("localhost");
  const id = uuidV4();
  const password = await hash("admin", 8);

  await connection.query(`
    INSERT INTO users (id, name, email, password, "isAdmin", created_at, driver_license)
    VALUES
    ('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', '')
  `);

  await connection.close();
}

create()
  .then(() => console.log("User admin created"))
  .catch((error) => {
    console.log(error);
    throw new AppError(`User admin create error: ${error}`);
  });
