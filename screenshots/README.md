# Screenshots

Add these files to this folder before submitting. Do not show real secrets or the `.env` file in any of them.

| File | What it shows |
|---|---|
| `01-health.png` | `GET /health` returning 200 with `database.state: connected` and `ping: ok` |
| `02-signup-201.png` | Successful signup (201, no password in the response) |
| `03-signup-409.png` | Duplicate username or email (409) |
| `04-login-jwt.png` | Successful login returning a JWT |
| `05-employees-crud.png` | Create, list, update and delete of an employee |
| `06-validation-400.png` | Validation failure with per-field errors |
| `07-no-jwt-401.png` | Employee request without a token (401) |
| `08-ownership-403.png` | User A (or B) trying to access the other user's employee (403) |
| `09-rate-limit-429.png` | The 11th login returning 429 with `Retry-After` |
| `10-helmet-headers.png` | `curl -i /health` showing the Helmet headers and no `X-Powered-By` |
| `11-logs.png` | `logs/app.log` (or `logs/sample.log`) showing request, auth and error lines |
| `12-compass-database.png` | MongoDB Compass: the `comp3123_assignment1` database and its collections |
| `13-compass-users-hashed.png` | `users` collection with bcrypt-hashed passwords |
| `14-compass-employees-owner.png` | `employees` collection showing the `user` owner field |
| `15-newman-run.png` | Terminal output of the newman run (0 failed) |
