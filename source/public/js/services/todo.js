export class Todo {
    constructor(
        id,
        title,
        description,
        duedate,
        priority,
        done = false,
        createdate = new Date().toJSON()
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.duedate = duedate; // TODO: which type? date or string?
        this.priority = Number(priority);
        this.done = done;
        this.createdate = createdate;

        // console.log('Todo', this);
    }
}
