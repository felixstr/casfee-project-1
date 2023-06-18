# CAS FEE • Project 1 - Todo App

A simple todo app using `express` and `nedb` in the backend and vanilla js in the frontend.

## Install and run the project

Install the dependencies:

```
npm install
```

Start the app

```
npm start
```

## REST API

| URL           | Method | Description   |
| ------------- | ------ | ------------- |
| api/todos     | GET    | get all todos |
| api/todos     | POST   | add a todo    |
| api/todos/:id | PATCH  | update a todo |
| api/todos/:id | DELETE | delete a todo |
| api/todos/:id | GET    | get a todo    |

## Worklog

### HTML

-   [x] Base HTML (Button, Todolist, Formfields)
-   [x] Use `dialog` element to show the form
-   [ ] (optional) Using handlebars for the templates
-   [x] use button or input element for bullet
-   [x] use toggle for show/hide completed todos
-   [x] add favicon
-   [x] accessibility: keyboard navigation
-   [x] add sort buttons

### CSS

-   [x] Base CSS (Button, Todolist, Formfields)
-   [x] Darkmode with custom properties
-   [x] fix bullet moving when adding completed modifier

### JS

-   [x] Darkmode toggle
-   [x] Save colormode in local storage
-   [x] create controller for the todos
-   [x] save todos in local storage
-   [x] save sortBy in local storage
-   [x] organise according to MVC
-   [x] (optional) create service/storage class for localstorage settings (color mode, complete toggle)
-   [x] duedate: show day count if less than 7 days
-   [x] duedate: warn color if in the past
-   [x] use `Intl.RelativeTimeFormat`
-   [x] add REST backend with database
-   [x] set createdate in the backend
-   [x] change file structure: separate folders in `server` and `client`
-   [x] set min value to duedate input field (only for todo add)
