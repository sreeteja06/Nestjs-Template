## Postman import
- Import [ProjectName.postman_collection.json](./ProjectName.postman_collection.json)
- Import [ProjectName.postman_environment.json](./ProjectName.postman_environment.json)
- Select `Project Local` as Postman's current environment.
- Edit `Project Local` environment by entering values for the following variables:
  - Add variable list here
  - Add variable list here
<br>


> <br>
>
> **NOTE**
>
> If request to manage companies or applications becomes unauthorized because Auth0 JWT token has expired then you should do the following:
> - Log into `SB2.0`.
> - Open browser's `Dev Tools` -> `Application` tab -> `Local Storage`.
> - Copy value of `token` variable.
> - Paste this value to Postman's `jwt` environment variable in `API Local` environment.
>
> All requests to manage the applications use `jwt` environment variable in their `Authorization` header.
>
> <br>
