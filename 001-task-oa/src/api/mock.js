export const taskList = [
  {
    id: 1,
    task: "学习TypeScript",
    status: 1,
    time: "2020-12-01 23:59:59",
    complete: "2020-11-30 18:02:38",
  },
  {
    id: 2,
    task: "整理文档",
    status: 1,
    time: "2021-12-01 23:59:59",
    complete: "2021-11-30 18:02:38",
  },
  {
    id: 3,
    task: "练习案例",
    status: 0, // 0 未完成，1已完成
    time: "2022-12-01 23:59:59",
    complete: "2022-11-30 18:02:38", // 完成时间
  },
];

export function mockApi(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: "0",
        data,
      });
    }, 300);
  });
}
