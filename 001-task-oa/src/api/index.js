import { mockApi, taskList } from "./mock";

export function getTaskList(status) {
  const data =
    status === "" || status === undefined
      ? taskList
      : taskList.filter((item) => item.status === status);
  return mockApi(data);
}

export function deleteTask(id) {
  return mockApi(id);
}

export function completeTask(id) {
  return mockApi(id);
}
