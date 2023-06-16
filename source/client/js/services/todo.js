export class Todo {
    constructor(id, title, description, duedate, priority, completed = false, createdate) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.setDuedate(duedate);
        this.setPriority(priority);
        this.completed = completed;
        this.createdate = createdate;
    }

    setPriority(priority) {
        this.priority = priority ? Number(priority) : null;
    }

    setDuedate(duedate) {
        this.duedate = duedate ? duedate : null;
    }
}
