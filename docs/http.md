# Calling external services (APIs)

> When you want to call an external service, you need to use the httpService thats in src/shared/http/http.service.ts

below is an example of how to use it.
The http service in this project send the x-request-id header to the requests.
the x-request-id is used to identify the request in the logs, this helps use track the requests.
It also logs the requests calls with the duration of the request.

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from './shared/http/http.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ExampleService {
    private readonly _logger: Logger = new Logger(AppService.name);

    constructor(private readonly _httpService: HttpService) {}

    public async testLogging(): Promise<void> {
        const resp = await lastValueFrom(
            this._httpService.get('https://abc.com/api/v1'),
        )
    }
}
```
