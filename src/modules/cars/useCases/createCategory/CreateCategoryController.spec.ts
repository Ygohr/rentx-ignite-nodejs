import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;
let refresh_token: string;

describe("Create Category Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(`
        DELETE FROM users WHERE "isAdmin" = true
    `);

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

  it("1) Should POST /categories and get statusCode 200 when creating a new category", async () => {
    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category Test",
        description: "Category Test"
      })
      .set({
        Authorization: `Bearer ${refresh_token}`
      });

    expect(response.status).toBe(201);
  });

  it("2) Should POST /categories and get status 400 when trying to create a existent category", async () => {
    const response = await request(app)
      .post("/categories")
      .send({
        name: "Category Test",
        description: "Category Test"
      })
      .set({
        Authorization: `Bearer ${refresh_token}`
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Category already exists");
  });
});
