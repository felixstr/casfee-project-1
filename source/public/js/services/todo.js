export class Todo {
    constructor(id, title, description, duedate, priority, done = false) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.duedate = duedate; // TODO: which type? date or string?
        this.priority = priority;
        this.done = done;
    }
    /*
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            duedate: this.duedate,
            priority: this.priority,
            done: this.done,
        };
    }
    */
}
