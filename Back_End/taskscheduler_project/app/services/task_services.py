from datetime import datetime,timezone
from ..database.mongo_db import tasks_collection,users_collection
from ..schema.task_schema import TaskCreate,TaskUpdate
from bson import ObjectId

 
from datetime import datetime, timezone

async def create_task(task_data: TaskCreate, user_email: str):
    try:
        current_time = datetime.now(timezone.utc)


        if task_data.due_date < current_time:
            return {
                "message": "Due date cannot be in the past",
                "status": "error"
            }

        task = {
            "title": task_data.title,
            "description": task_data.description,
            "creation_datetime": current_time,
            "due_date": task_data.due_date,
            "is_completed": task_data.is_completed,
            "user_email": user_email,
            "created_at": current_time
        }
        
        result = tasks_collection.insert_one(task)
        task["id"] = str(result.inserted_id)
        
        return {
            "message": "Task created successfully",
            "status": "success",
            "task": task
        }

    except Exception as e:
        return {
            "message": f"Task creation failed: {str(e)}",
            "status": "error"
        }
 
async def get_user_tasks(user_email: str):
    try:
        tasks = list(tasks_collection.find({"user_email": user_email}))
        for task in tasks:
            task["id"] = str(task["_id"])
            if "_id" in task:
                del task["_id"]
                
        return {"tasks": tasks, "status": "success"}
    except Exception as e:
        return {"message": f"Failed to get tasks: {str(e)}", "status": "error"}
 
async def update_task(task_id: str, task_data: TaskUpdate, user_email: str):
    try:
        # 🔹 Get existing task
        task = tasks_collection.find_one({
            "_id": ObjectId(task_id),
            "user_email": user_email
        })

        if not task:
            return {"message": "Task not found", "status": "error"}

        update_data = {
            k: v for k, v in task_data.model_dump().items() if v is not None
        }

        current_time = datetime.now(timezone.utc)

        # 🔴 Rule 1: If completed → block edits
        if task.get("is_completed"):
            restricted_fields = {"title", "description", "due_date"}

            if any(field in update_data for field in restricted_fields):
                return {
                    "message": "Completed task cannot be edited",
                    "status": "error"
                }

        # 🔴 Rule 2: Validate due_date if updating
        if "due_date" in update_data:
            if update_data["due_date"] < current_time:
                return {
                    "message": "Due date cannot be in the past",
                    "status": "error"
                }

        # 🔹 Update task
        result = tasks_collection.update_one(
            {"_id": ObjectId(task_id), "user_email": user_email},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            return {"message": "Task not found", "status": "error"}

        return {
            "message": "Task updated successfully",
            "status": "success"
        }

    except Exception as e:
        return {
            "message": f"Task update failed: {str(e)}",
            "status": "error"
        }
 
async def delete_task(task_id: str, user_email: str):
    try:
        result = tasks_collection.delete_one({"_id": ObjectId(task_id), "user_email": user_email})
        
        if result.deleted_count == 0:
            return {"message": "Task not found", "status": "error"}
        
        return {"message": "Task deleted successfully", "status": "success"}
    except Exception as e:
        return {"message": f"Task deletion failed: {str(e)}", "status": "error"}
