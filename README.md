# Fetch-Service

This is a Library that uses Decorators to define Services on client-side.
I was heavely inspired by the syntax that is used in [ASP.Net core](https://github.com/dotnet/aspnetcore) or [NEST](https://github.com/nestjs/nest).
The goal was to create a System that allows the Developer to create Services that execute requests in a way that resembles the way they are defined in the backend.

### Installation

```sh
$ yarn add @ws/fetch-service
```

## Usage

### <a id="Api"></a> `Api` class

This class is the base of every Service you create.
It is supported to extend from this class and use that class instead.

### <a id="Service"></a> `@Service(host?: string = '[BASE]/[SERVICE]')` decorator

With this Decorator you define the base URL this Service will use. This will be used to initialize a URL-Object so use a valid url.

It is supported to use [template-expressions](#TemplateReplacer) inside the url.

### <a id="ResponseParser"></a> `ResponseParser` class

Class to provide some usefull methods to parse a response of a request.
It is used to execute a fetch request from a Context provieded through the Api-Class.

Methods:

- `asJson<T>`: Parses the response and returns an object with type T
- `asJsonArray<T>`: Parses the response and returns an array with type T[]
- `asArrayBuffer`: Calls Response.arrayBuffer() internaly
- `asBlob`: Calls Response.blob() internaly
- `asFormData`: Calls Response.formData() internaly
- `asText`: Calls Response.text() internaly
- `asRaw`: Returns the (raw) response object

### <a id="GetResponse"></a> `Api::GetResponse(): ResponseParser` method

When in the Context of a Requesting Method calling `this.GetResponse()` returns and instance of the ResponseParser. This is a class that provides utilities to parse a response of a fetch request. The request is only executed when one of the methods on the instance are called. When the response should be ignored you can just call `this.GetResponse().asRaw()` which would return the plain response-object.

### <a id="Template"></a> `Template` function

Creates an UrlTemplate that is used to create the url of the request. The keys provided are resolved with the given keys from all `@Param` decorators.

### <a id="Method"></a> `@Method(type: RequestType, template?: UrlTemplate = '/[ACTION]')` decorator

Decorator that creates the url of the Request. When no template is provided it uses the name of the method it decorates to create the url.

When the decorated method is called it uses the arguments and metadata from `@Param` to fill in the template.

### <a id="Param"></a> `@Param(parameterName?: string)` decorator

Attaches metadata to the method that is evaluated by the `@Method` decorator to fill in the template. When the Parameter `parameterName` is undefined it uses the name of the parameter that it decorates.

### <a id="Query"></a> `@Query(name?: string)` decorator

> !Only supports values that are either `string` or `object`

Decorator to define what query value/s should be used in the url of the request.
When evaluated it uses the given value to add a `URL.searchParams` to the method. When the value is an object it uses the entrys of that to add parameters. When the value is a string the parametername is used as a key and the value as the value. Other types are ignored.

### <a id="Body"></a> `@Body()` decorator

When evaluated, sets the body of the request to the value of the parameter.
If the value is an object it serializes it with help of [class-transformer](https://github.com/typestack/class-transformer).

### <a id="Header"></a> `@Header(headers: Record<string, string>)` decorator

Attaches headers to the request. It merges all Headers of the request.

### <a id="Middleware"></a> `@Middleware(...middlewares: ApiMiddleware[])` decorator

Adds Middlewares to the request.

### <a id="TemplateReplacer"></a> 'TemplateReplacer' class

This is a class that defines what strings should be replaced during evaluation time.
You are open to add custom one inside your project by calling `TemplateReplacer.addReplacer` or using the exported alias `defineTemplate`.

List of default replacers:

| `Regex`             | `Replacer`                                                    | Description                                                                      |
| :------------------ | :------------------------------------------------------------ | :------------------------------------------------------------------------------- |
| `/(\[SERVICE\])/gi` | `ctx => ctx.target.constructor.name.replace(/SERVICE/gi, '')` | Uses the name of the attached class and replaces all 'Service' strings           |
| `/(\[ACTION\])/gi`  | `ctx => ctx.key`                                              | Uses the propertyKey                                                             |
| `/(\[BASE\])/gi`    | `() => '[HOST]:[PORT]/[PATH]'`                                | Because it is executed before the following it can use them to define a template |
| `/(\[HOST\])/gi`    | `() => process.env.API_HOST ?? ''`                            | Uses a env variable                                                              |
| `/(\[PORT\])/gi`    | `() => process.env.API_PORT ?? ''`                            | Uses a env variable                                                              |
| `/(\[PATH\])/gi`    | `() => process.env.API_BASE ?? ''`                            | Uses a env variable                                                              |

### A basic Service

```js
import { Api, Service, Get, Post, Put, Patch, Delete, Template } from '@wf/fetch-service';

@Service('https://httpbin.org')
class SampleService extends Api {

    @Get(Template`/get`)
    public async get() {
        // -> Executes a GET Request to 'https://httpbin.org/get'
        await this.GetResponse().asRaw();
    }

    @Post(Template`/post`)
    public async post() {
        // -> Executes a POST Request to 'https://httpbin.org/post'
        await this.GetResponse().asRaw();
    }

    @Put(Template`/put`)
    public async put() {
        // -> Executes a PUT Request to 'https://httpbin.org/put'
        await this.GetResponse().asRaw();
    }

    @Patch(Template`/patch`)
    public async patch() {
        // -> Executes a PATCH Request to 'https://httpbin.org/patch'
        await this.GetResponse().asRaw();
    }

    @Delete(Template`/delete`)
    public async delete() {
        // -> Executes a DELETE Request to 'https://httpbin.org/delete'
        await this.GetResponse().asRaw();
    }
}
```

### More advanced Service

```js
import { Api, Service, Get, Template, Param, Query } from '@wf/fetch-service';

@Service('https://httpbin.org')
class SampleService extends Api {

    @Get(Template`/get/${"param"}`)
    public async getWithParam(@Param() param) {
        // SampleService.getWithParam("something");
        // -> Executes a GET Request to 'https://httpbin.org/get/something'
        await this.GetResponse().asRaw();
    }

    @Get(Template`/get/${"someParam"}`)
    public async getWithParamAlias(@Param("someParam") param) {
        // SampleService.getWithParamAlias("something");
        // -> Executes a GET Request to 'https://httpbin.org/get/something'
        await this.GetResponse().asRaw();
    }

    @Get(Template`/get`)
    public async getWithQuery(@Query() query) {
        // SampleService.getWithQuery("foo");
        // -> Executes a GET Request to 'https://httpbin.org/get?query=foo'
        // SampleService.getWithQuery({ foo: "bar", cow: "muh" });
        // -> Executes a GET Request to 'https://httpbin.org/get?foo=bar&cow=muh'
        await this.GetResponse().asRaw();
    }

    @Get(Template`/get`)
    public async getWithQuery(@Query("search") query) {
        // SampleService.getWithQuery("foo");
        // -> Executes a GET Request to 'https://httpbin.org/get?search=foo'
        // SampleService.getWithQuery({ foo: "bar", cow: "muh" });
        // -> Executes a GET Request to 'https://httpbin.org/get?foo=bar&cow=muh'
        await this.GetResponse().asRaw();
    }

    @Get(Template`/get`)
    public async getWithQuery(@Query("search") query) {
        // SampleService.getWithQuery("foo");
        // -> Executes a GET Request to 'https://httpbin.org/get?search=foo'
        // SampleService.getWithQuery({ foo: "bar", cow: "muh" });
        // -> Executes a GET Request to 'https://httpbin.org/get?foo=bar&cow=muh'
        await this.GetResponse().asRaw();
    }
}
```
