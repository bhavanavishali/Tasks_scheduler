from fastapi import APIRouter, Depends, HTTPException
from ..schema.task_schema import TaskCreate, TaskUpdate
from ..services.task_services import create_task, get_user_tasks, update_task, delete_task
from ..utils.auth_dependency import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/")
async def create_task_endpoint(task: TaskCreate, current_user = Depends(get_current_user)):
    result = await create_task(task, current_user["email"])
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    task_data = result["task"]
    if "_id" in task_data:
        del task_data["_id"]
    return result

@router.get("/")
async def get_tasks_endpoint(current_user = Depends(get_current_user)):
    result = await get_user_tasks(current_user["email"])
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    
    for task in result["tasks"]:
        if "_id" in task:
            del task["_id"]
            
    return result

@router.patch("/{task_id}")
async def update_task_endpoint(task_id: str, task: TaskUpdate, current_user = Depends(get_current_user)):
    result = await update_task(task_id, task, current_user["email"])
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.delete("/{task_id}")
async def delete_task_endpoint(task_id: str, current_user = Depends(get_current_user)):
    result = await delete_task(task_id, current_user["email"])
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result