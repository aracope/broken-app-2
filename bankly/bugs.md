1. Found in models/user.js User.get:
```js
if (!user) {
  new ExpressError('No such user', 404);
}
```
changed to 
```js
if (!user) {
  throw new ExpressError('No such user', 404);
}
```
-- The error is created, but never thrown, so nothing happens. This fails silently, and the route just returns undefined

2. User.getAll ignores auth and returns all user data
 The method returns too much info — email, phone — violating the docstring.
 ```js
 static async getAll(username, password) {
  const result = await db.query(
    `SELECT username,
              first_name,
              last_name,
              email,
              phone
          FROM users 
          ORDER BY username`
  );
  ...
```
changed to:
```js
static async getAll(username, password) {
const result = await db.query(
  `SELECT username,
            first_name,
            last_name
    FROM users 
    ORDER BY username`
);
...
```