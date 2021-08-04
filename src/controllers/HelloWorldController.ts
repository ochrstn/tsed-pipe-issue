import {Controller, Get, Injectable, ParamTypes, PipeMethods, UseParam, UsePipe} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {Required, Returns} from "@tsed/schema";

class PersonModel {
  @Required()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

@Injectable()
export class PersonPipe implements PipeMethods<string, Promise<PersonModel>> {
  async transform(id: string): Promise<PersonModel> {
    return new PersonModel("John Doe");
  }
}

function UsePersonParam(expression: string): ParameterDecorator {
  return useDecorators(UseParam(ParamTypes.PATH, {expression, useType: String}), UsePipe(PersonPipe));
}

@Controller("/hello-world")
export class HelloWorldController {
  @Get("/test1/:id")
  @Returns(200, PersonModel)
  test1(@UsePersonParam("id") person: PersonModel) {
    return person;
  }

  @Get("/test2")
  @Returns(200, PersonModel)
  test2() {
    return new PersonModel("Jane Doe");
  }
}
