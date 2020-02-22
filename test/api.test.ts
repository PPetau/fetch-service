import { Api } from 'api';
import { Service, Method } from 'decorators';
import { Template } from 'type/Template';

describe('basic', () => {
  it('is service', () => {
    @Service('http://httpbin.org')
    class TestService extends Api {
      @Method('GET', Template`/delay/1`)
      public async getTest(): Promise<Response> {
        return this.GetResponse().asRaw();
      }
    }

    const test = new TestService();

    test.getTest().then(console.log);
  });
});
