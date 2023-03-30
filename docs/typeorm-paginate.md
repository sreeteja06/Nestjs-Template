# Using the paginateDto

You can extend your dto with paginateDto,
This adds the following properties
    - page = default 1 and only accepts positive number and minimum value 1
    - limit = default 100 and only accepts positive number

```typescript
class allUsersDto extends PaginateOptionsDto {
    @IsPositive()
    @IsInt()
    @Min(1)
    startingFrom: number;
}
```

# Using the pagination
```typescript
const findAll = async ():Promise<Pagination<User>> => {
    return paginate<User>(this._userRepository.createQueryBuilder(), {
      page: 1,
      limit: 100,
    });
  }
```

# Using the decorator
You can use the decorator ApiPaginatedSwagger to add the swagger documentation to the response
```typescript
class UserController {
  @Get()
  @ApiPaginatedSwagger(User)
  async findAll(): Promise<Pagination<User>> {
    return this.userService.findAll();
  }
}
```
The above will generate the following example in the swagger
```JSON
{
  "items": [
    {
      "userId": 0,
      "name": "string",
      "createdAt": "2021-10-19T13:04:59.909Z",
      "updatedAt": "2021-10-19T13:04:59.909Z",
      "deletedAt": "2021-10-19T13:04:59.909Z"
    }
  ],
  "meta": {
    "itemCount": 0,
    "totalItems": 0,
    "itemsPerPage": 0,
    "totalPages": 0,
    "currentPage": 0
  }
}
```