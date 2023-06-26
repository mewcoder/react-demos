import { mockApi, taskList } from "./mock";

export function getTaskList(status) {
  const data =
    status === "" || status === undefined
      ? taskList
      : taskList.filter((item) => item.status === status);
  return mockApi(data);
}

export function deleteTask(id) {
  return mockApi("ok");
}

export function completeTask(id) {
  return mockApi("ok");
}

export function addTask(task, time) {
  return mockApi("ok");
}
