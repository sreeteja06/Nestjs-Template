## Redis Usage
```typescript
class service {
    constructor(
        @InjectRedis()
        private readonly _redis: Redis,
    ) {}
    
    async method() {
        const result = await redis.get('key');
        return result;
    }
}
```
