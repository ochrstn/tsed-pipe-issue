import {PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import {HelloWorldController} from "./HelloWorldController";
import {Server} from "../Server";
import {getSpec} from "@tsed/schema";

describe("HelloWorldController", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(
    PlatformTest.bootstrap(Server, {
      mount: {
        "/": [HelloWorldController]
      }
    })
  );
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  describe("endpoint width parameter", () => {
    it("should call GET /hello-world/test1/foo", async () => {
      const response = await request.get("/hello-world/test1/foo").expect(200);
      expect(response.body).toEqual({name: "John Doe"});
    });

    it("should have string parameter", async () => {
      const spec = getSpec(HelloWorldController);
      expect((spec as any).paths["/hello-world/test1/{id}"]["get"]["parameters"][0]["type"]).toBe("string");
    });

    it("should have model response", async () => {
      const spec = getSpec(HelloWorldController);
      expect((spec as any).paths["/hello-world/test1/{id}"]["get"]["responses"]["200"]["schema"]["$ref"]).toBe("#/definitions/PersonModel");
    });
  });

  describe("endpoint without parameter", () => {
    it("should call GET /hello-world/test2", async () => {
      const response = await request.get("/hello-world/test2").expect(200);
      expect(response.body).toEqual({name: "Jane Doe"});
    });
    it("should have model response", async () => {
      const spec = getSpec(HelloWorldController);
      expect((spec as any).paths["/hello-world/test2"]["get"]["responses"]["200"]["schema"]["$ref"]).toBe("#/definitions/PersonModel");
    });
  });
});
