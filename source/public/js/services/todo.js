export class Todo {
    constructor(id, title, description, duedate, priority, done = false, createdate) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.setDuedate(duedate);
        this.setPriority(priority);
        this.done = done;
        this.createdate = createdate;

        // console.log('Todo', this);
    }

    setPriority(priority) {
        this.priority = priority ? Number(priority) : null;
    }

    setDuedate(duedate) {
        this.duedate = duedate ? duedate : null;
    }
}
