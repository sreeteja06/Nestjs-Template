# Side Effects
The following files have side effects to the request responses.
- not_found.interceptor.ts
    - returns 404 if the response is undefined
    - returns 404 if the response is of instance DeleteResult or UpdateResult and not even one row is affected.
    - returns 'ok' if the response is of instance DeleteResult or UpdateResult and at least one row is affected.
- user_activity.interceptor.ts
    - logs activity.
    - this should include checking user in request object and saving the user activity in the database.
- error.filter.ts
    - This filter catches the exception and changes the response of the request, it adds the statusCode and the message to the response.
    - Logs the internal server errors
    - Internal server error will not return message in production.
