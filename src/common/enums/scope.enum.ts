export enum Scope {
    // this will check the is admin parameter in the app metadata for the audience.
    IS_ADMIN_FOR_APP = 'is_admin_for_app',
    // these are the jwt scopes
    ADMIN = 'admin',
    READ_ONLY = 'readOnly',
}
