# Dynamic Form

## Data flow

1. `dispatch` a global `action` from userForm `component`
2. `global` model `query` the backend like `lowdb`
3. `global` model `put` payload to `user` model `effects` method
4. `user` model `effects` method got the payload and `put` to `reducers` method
5. `connect` model to `component`, with `namespace` of the model
6. component get the `props` and render the final data


## Flow Chart

|***********MForm**************|
|             |                |
|          <dispatch>          |
|             |                |
|==============================|
|    |--- global model ---|    |<--lowdb   | <=== [_mock]
|       |-- effects -|         |
|             |                |
|             |                |
|          <call/put>          |
|             |                |
|==============================|
|             |                |
|             |                |
|             |                |
|==============================|
|   |--- user model ---|       |
|       |-- effects -|         |
|             |                |
|             |                |
|          <call/put>          |
|             |                |
|             |                |
|       |-- reducers -|        |
|             |                |
|       |-- state --|          |
|==============================|
|             |                |
|          <connect>           |
|             |                |
|       |-- props --|          |
|*********component-***********|
|             |                |
|           render             |
|             |                |
|************page**************|
