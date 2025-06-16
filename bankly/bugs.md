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
3. DELETE route doesn’t await User.delete. The response is sent without waiting for the deletion to happen.
```js
User.delete(req.params.username);
return res.json({ message: 'deleted' });
```
changed to:
```js
await User.delete(req.params.username);
return res.json({ message: 'deleted' });
```

4. Login route missing await on authenticate.
User.authenticate is async, but not awaited. A token with undefined.admin is created.
```js
let user = User.authenticate(username, password);
const token = createTokenForUser(username, user.admin);
```
changed to:
```js
let user = await User.authenticate(username, password);
```

5. PATCH route unnecessarily requires admin always
```js
router.patch('/:username', authUser, requireLogin, requireAdmin, ...
```
changed to:
```js
router.patch('/:username', authUser, requireLogin, async function(...
```
to rely on this logic in the function
```js
if (!req.curr_admin && req.curr_username !== req.params.username) {
  throw new ExpressError('Only that user or admin can edit a user.', 401);
}
```

6. middleware/auth.js:authUser uses jwt.decode instead of jwt.verify
```js
let payload = jwt.decode(token);
req.curr_username = payload.username;
req.curr_admin = payload.admin;
```
* jwt.decode does not check the token signature at all.
Anyone could send any JWT-like string, and the app would accept it without verifying its authenticity.

* jwt.verify(token, SECRET_KEY) should be used — this ensures the token was really signed with the server’s secret key.

replaced:
```js
let payload = jwt.decode(token);
```
with:
```js
let payload = jwt.verify(token, SECRET_KEY);
```