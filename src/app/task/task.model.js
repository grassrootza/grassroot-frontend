"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var task_type_1 = require("./task-type");
var todo_type_1 = require("./todo-type");
var Task = /** @class */ (function () {
    function Task(taskUid, title, type, deadlineMillis, deadlineDate, description, location, parentUid, parentName, ancestorGroupName, todoType, hasResponded, wholeGroupAssigned, thisUserAssigned, createdByUserName) {
        this.taskUid = taskUid;
        this.title = title;
        this.type = type;
        this.deadlineMillis = deadlineMillis;
        this.deadlineDate = deadlineDate;
        this.description = description;
        this.location = location;
        this.parentUid = parentUid;
        this.parentName = parentName;
        this.ancestorGroupName = ancestorGroupName;
        this.todoType = todoType;
        this.hasResponded = hasResponded;
        this.wholeGroupAssigned = wholeGroupAssigned;
        this.thisUserAssigned = thisUserAssigned;
        this.createdByUserName = createdByUserName;
    }
    Task.prototype.getEventIconName = function () {
        if (this.type == task_type_1.TaskType.MEETING)
            return "icon_meeting.png";
        else if (this.type == task_type_1.TaskType.VOTE)
            return "icon_vote.png";
        else if (this.type == task_type_1.TaskType.TODO)
            return "icon_todo.png";
        else
            return "";
    };
    Task.createInstanceFromData = function (taskData) {
        return new Task(taskData.taskUid, taskData.title, taskData.type = task_type_1.TaskType[taskData.type], taskData.deadlineMillis, new Date(taskData.deadlineMillis), taskData.description, taskData.location, taskData.parentUid, taskData.parentName, taskData.ancestorGroupName, taskData.todoType != null ? todo_type_1.TodoType[taskData.todoType] : null, taskData.hasResponded, taskData.wholeGroupAssigned, taskData.thisUserAssigned, taskData.createdByUserName);
    };
    return Task;
}());
exports.Task = Task;
