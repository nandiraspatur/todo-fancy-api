## TODO Fancy API
Simple App TODO list

### List of basic routes:
### Task
| Route | HTTP | Description |
|-------|------|-------------|
| ``http://localhost:3000/`` | GET | Get All List Task Data |
| ``http://localhost:3000/`` | POST | Post New Task Data |
| ``http://localhost:3000/:id`` | PUT | Edit Task Data |
| ``http://localhost:3000/done/:id`` | PUT | Set Task Status |
| ``http://localhost:3000/:id`` | DELETE | Delete Task Data |

### User
| Route | HTTP | Description |
|-------|------|-------------|
| ``http://localhost:3000/all`` | GET | Get All Users Data |
| ``http://localhost:3000/`` | GET | Get One User By Option |
| ``http://localhost:3000/login`` | POST | Login |
| ``http://localhost:3000/register`` | POST | Register |
| ``http://localhost:3000/logout`` | GET | Logout |
| ``http://localhost:3000/:id`` | PUT | Edit User Data By ID |
| ``http://localhost:3000/:id`` | DELETE | Delete User Data By ID |

#### USAGE
with only npm in directory ``server``:
<pre>npm install
npm start
npm run dev</pre>

Add your ``<secret key>`` to ```.env_template``` and rename file to ```.env``` before use this API

Access the website via ```/client/index.html``` or API via ```http://localhost:3000/api```.
