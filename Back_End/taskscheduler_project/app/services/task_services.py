# from datetime import datetime,timezone
# from ..database.mongo_db import tasks_collection,users_collection
# from ..schema.task_schema import TaskCreate,TaskUpdate
# from bson import ObjectId

 
# from datetime import datetime, timezone

# async def create_task(task_data: TaskCreate, user_email: str):
#     try:
#         current_time = datetime.now(timezone.utc)


#         if task_data.due_date < current_time:
#             return {
#                 "message": "Due date cannot be in the past",
#                 "status": "error"
#             }

#         task = {
#             "title": task_data.title,
#             "description": task_data.description,
#             "creation_datetime": current_time,
#             "due_date": task_data.due_date,
#             "is_completed": task_data.is_completed,
#             "user_email": user_email,
#             "created_at": current_time
#         }
        
#         result = tasks_collection.insert_one(task)
#         task["id"] = str(result.inserted_id)
        
#         return {
#             "message": "Task created successfully",
#             "status": "success",
#             "task": task
#         }

#     except Exception as e:
#         return {
#             "message": f"Task creation failed: {str(e)}",
#             "status": "error"
#         }
 
# async def get_user_tasks(user_email: str):
#     try:
#         tasks = list(tasks_collection.find({"user_email": user_email}))
#         for task in tasks:
#             task["id"] = str(task["_id"])
#             if "_id" in task:
#                 del task["_id"]
                
#         return {"tasks": tasks, "status": "success"}
#     except Exception as e:
#         return {"message": f"Failed to get tasks: {str(e)}", "status": "error"}
 
# async def update_task(task_id: str, task_data: TaskUpdate, user_email: str):
#     try:
#         # 🔹 Get existing task
#         task = tasks_collection.find_one({
#             "_id": ObjectId(task_id),
#             "user_email": user_email
#         })

#         if not task:
#             return {"message": "Task not found", "status": "error"}

#         update_data = {
#             k: v for k, v in task_data.model_dump().items() if v is not None
#         }

#         current_time = datetime.now(timezone.utc)


#         if task.get("is_completed"):
#             restricted_fields = {"title", "description", "due_date"}

#             if any(field in update_data for field in restricted_fields):
#                 return {
#                     "message": "Completed task cannot be edited",
#                     "status": "error"
#                 }

#         # 🔴 Rule 2: Validate due_date if updating
#         if "due_date" in update_data:
#             if update_data["due_date"] < current_time:
#                 return {
#                     "message": "Due date cannot be in the past",
#                     "status": "error"
#                 }

#         # 🔹 Update task
#         result = tasks_collection.update_one(
#             {"_id": ObjectId(task_id), "user_email": user_email},
#             {"$set": update_data}
#         )

#         if result.matched_count == 0:
#             return {"message": "Task not found", "status": "error"}

#         return {
#             "message": "Task updated successfully",
#             "status": "success"
#         }

#     except Exception as e:
#         return {
#             "message": f"Task update failed: {str(e)}",
#             "status": "error"
#         }
 
# async def delete_task(task_id: str, user_email: str):
#     try:
#         result = tasks_collection.delete_one({"_id": ObjectId(task_id), "user_email": user_email})
        
#         if result.deleted_count == 0:
#             return {"message": "Task not found", "status": "error"}
        
#         return {"message": "Task deleted successfully", "status": "success"}
#     except Exception as e:
#         return {"message": f"Task deletion failed: {str(e)}", "status": "error"}


from datetime import datetime, timezone
from ..database.mongo_db import tasks_collection, users_collection
from ..schema.task_schema import TaskCreate, TaskUpdate
from bson import ObjectId
import re
import logging

logger = logging.getLogger(__name__)

def validate_text(text: str):
    pattern = r'^[A-Za-z0-9\s]+$'
    return re.match(pattern, text)


async def create_task(task_data: TaskCreate, user_email: str):
    try:
        logger.info(f"Create task request started for user: {user_email}")

        current_time = datetime.now(timezone.utc)

        # ✅ Title validation
        if not validate_text(task_data.title):
            logger.warning(f"Invalid task title provided by user: {user_email}")

            return {
                "message": "Title only allows letters and digits",
                "status": "error"
            }

      
        if not validate_text(task_data.description):
            logger.warning(f"Invalid task description provided by user: {user_email}")

            return {
                "message": "Description only allows letters and digits",
                "status": "error"
            }

        if task_data.due_date < current_time:
            logger.warning(f"Past due date provided by user: {user_email}")

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

        logger.info(
            f"Task created successfully with id: {task['id']} for user: {user_email}"
        )

        return {
            "message": "Task created successfully",
            "status": "success",
            "task": task
        }

    except Exception as e:
        logger.exception(f"Task creation failed for user: {user_email}")

        return {
            "message": f"Task creation failed: {str(e)}",
            "status": "error"
        }


async def get_user_tasks(user_email: str):
    try:
        logger.info(f"Fetching tasks for user: {user_email}")

        tasks = list(tasks_collection.find({"user_email": user_email}))

        for task in tasks:
            task["id"] = str(task["_id"])

            if "_id" in task:
                del task["_id"]

        logger.info(
            f"Successfully fetched {len(tasks)} tasks for user: {user_email}"
        )

        return {
            "tasks": tasks,
            "status": "success"
        }

    except Exception as e:
        logger.exception(f"Failed to fetch tasks for user: {user_email}")

        return {
            "message": f"Failed to get tasks: {str(e)}",
            "status": "error"
        }


async def update_task(task_id: str, task_data: TaskUpdate, user_email: str):
    try:
        logger.info(
            f"Update task request started for task_id: {task_id}, user: {user_email}"
        )

        task = tasks_collection.find_one({
            "_id": ObjectId(task_id),
            "user_email": user_email
        })

        if not task:
            logger.warning(
                f"Task not found for update. task_id: {task_id}, user: {user_email}"
            )

            return {
                "message": "Task not found",
                "status": "error"
            }

        update_data = {
            k: v for k, v in task_data.model_dump().items()
            if v is not None
        }

        current_time = datetime.now(timezone.utc)

       
        if "title" in update_data:
            if not validate_text(update_data["title"]):
                logger.warning(
                    f"Invalid title update attempted for task_id: {task_id}"
                )

                return {
                    "message": "Title only allows letters and digits",
                    "status": "error"
                }

       
        if "description" in update_data:
            if not validate_text(update_data["description"]):
                logger.warning(
                    f"Invalid description update attempted for task_id: {task_id}"
                )

                return {
                    "message": "Description only allows letters and digits",
                    "status": "error"
                }

        if task.get("is_completed"):
            restricted_fields = {"title", "description", "due_date"}

            if any(field in update_data for field in restricted_fields):
                logger.warning(
                    f"Attempt to edit completed task. task_id: {task_id}"
                )

                return {
                    "message": "Completed task cannot be edited",
                    "status": "error"
                }

        if "due_date" in update_data:
            if update_data["due_date"] < current_time:
                logger.warning(
                    f"Past due date update attempted for task_id: {task_id}"
                )

                return {
                    "message": "Due date cannot be in the past",
                    "status": "error"
                }

        result = tasks_collection.update_one(
            {
                "_id": ObjectId(task_id),
                "user_email": user_email
            },
            {
                "$set": update_data
            }
        )

        if result.matched_count == 0:
            logger.warning(
                f"Task update failed because task not found. task_id: {task_id}"
            )

            return {
                "message": "Task not found",
                "status": "error"
            }

        logger.info(
            f"Task updated successfully. task_id: {task_id}, user: {user_email}"
        )

        return {
            "message": "Task updated successfully",
            "status": "success"
        }

    except Exception as e:
        logger.exception(
            f"Task update failed for task_id: {task_id}, user: {user_email}"
        )

        return {
            "message": f"Task update failed: {str(e)}",
            "status": "error"
        }


async def delete_task(task_id: str, user_email: str):
    try:
        logger.info(
            f"Delete task request started for task_id: {task_id}, user: {user_email}"
        )

        result = tasks_collection.delete_one({
            "_id": ObjectId(task_id),
            "user_email": user_email
        })

        if result.deleted_count == 0:
            logger.warning(
                f"Task not found for deletion. task_id: {task_id}"
            )

            return {
                "message": "Task not found",
                "status": "error"
            }

        logger.info(
            f"Task deleted successfully. task_id: {task_id}, user: {user_email}"
        )

        return {
            "message": "Task deleted successfully",
            "status": "success"
        }

    except Exception as e:
        logger.exception(
            f"Task deletion failed for task_id: {task_id}, user: {user_email}"
        )

        return {
            "message": f"Task deletion failed: {str(e)}",
            "status": "error"
        }