import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;
let refresh_token: string;

describe("List Categories Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(`
        INSERT INTO users (id, name, email, password, "isAdmin", created_at, driver_license)
        VALUES
        ('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', '')
    `);

    const responseToken = await request(app).post("/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin"
    });
    refresh_token = responseToken.body.refresh_token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("1) Shoul GET /categories and get statusCode 200 when listing all categories", async () => {
    await request(app)
      .post("/categories")
      .send({
        name: "Category Test",
        description: "Category Test"
      })
      .set({
        Authorization: `Bearer ${refresh_token}`
      });

    const response = await request(app).get("/categories");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
