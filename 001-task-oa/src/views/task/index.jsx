import React from "react";
import { Button, Radio, Table, Popconfirm, message } from "antd";
import "./index.less";
import { getTaskList, deleteTask, completeTask } from "../../api";
import { formatTime } from "../../utils";

export default class Task extends React.Component {
  // 数据
  state = {
    dataList: [],
    loading: false,
    currentStatus: "",
  };

  columns = [
    {
      title: "编号",
      dataIndex: "id",
      align: "center",
      width: "8%",
    },
    {
      title: "任务描述",
      dataIndex: "task",
      ellipsis: true,
      width: "50%",
    },
    {
      title: "状态",
      dataIndex: "status",
      align: "center",
      width: "10%",
      render: (status) => (status === 1 ? "已完未" : "已完成"),
    },
    {
      title: "完成时间",
      dataIndex: "time",
      align: "center",
      width: "15%",
      render: (_, record) => {
        const { status, time, complete } = record;
        return formatTime(status === 1 ? complete : time);
      },
    },
    {
      title: "操作",
      render: (_, record) => {
        const { status, id } = record;
        return (
          <>
            <Popconfirm
              title="您确定要删除此任务吗？"
              onConfirm={this.handleDelete.bind(null, id)}
            >
              <Button type="link">删除</Button>
            </Popconfirm>
            {status !== 0 ? (
              <Popconfirm
                title="您确把此任务设置为完成吗？"
                onConfirm={this.handleComplete.bind(null, id)}
              >
                <Button type="link">完成</Button>
              </Popconfirm>
            ) : null}
          </>
        );
      },
    },
  ];

  queryData = async (status) => {
    try {
      this.setState({ loading: true });
      const { code, data } = await getTaskList(status);
      if (code === "0") {
        this.setState({
          dataList: data,
        });
      }
    } catch {
      /* empty */
    }
    this.setState({ loading: false });
  };

  handleFilter = (e) => {
    const status = e.target.value;
    if (this.state.currentStatus === status) return;
    this.setState({
      currentStatus: status,
    });
    this.queryData(status);
  };

  handleDelete = async (id) => {
    try {
      this.setState({ loading: true });
      const { code } = await deleteTask(id);
      if (code === "0") {
        this.queryData();
        message.success("删除成功！");
      } else {
        message.error("删除失败！");
      }
    } catch {
      /* empty */
    }
  };

  handleComplete = async (id) => {
    try {
      this.setState({ loading: true });
      const { code } = await completeTask(id);
      if (code === "0") {
        this.queryData();
        message.success("操作成功！");
      } else {
        message.error("操作失败！");
      }
    } catch {
      /* empty */
    }
  };

  componentDidMount() {
    console.log("componentDidMount");
    this.queryData();
  }

  render() {
    const { dataList, loading } = this.state;

    return (
      <div className="container">
        <header className="header">
          <div className="title">
            <h2 className="title__text">TASK OA 任务管理系统</h2>
            <Button type="primary">新增任务</Button>
          </div>

          {/* 筛选 */}
          <div className="tags">
            <Radio.Group
              defaultValue=""
              buttonStyle="solid"
              onChange={this.handleFilter}
            >
              <Radio.Button value="">全部</Radio.Button>
              <Radio.Button value={0}>未完成</Radio.Button>
              <Radio.Button value={1}>已完成</Radio.Button>
            </Radio.Group>
          </div>
        </header>

        {/* 表格 */}
        <main className="table">
          <Table
            dataSource={dataList}
            columns={this.columns}
            loading={loading}
            pagination={false}
            rowKey="id"
          />
        </main>
      </div>
    );
  }
}
