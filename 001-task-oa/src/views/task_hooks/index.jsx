import { useState, useEffect, useRef } from "react";
import {
  Button,
  Radio,
  Table,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  DatePicker,
} from "antd";
import "./index.less";
import { getTaskList, deleteTask, completeTask, addTask } from "@/api";
import { formatTime } from "@/utils";

export default function Task() {
  const [currentStatus, setCurrentStatus] = useState("");
  const [dataList, setDataList] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const formRef = useRef();

  const queryData = async (status) => {
    try {
      setTableLoading(true);
      const { code, data } = await getTaskList(status);
      if (code === "0") {
        setDataList(data);
      }
    } catch {
      /* empty */
    }
    setTableLoading(false);
  };

  useEffect(() => {
    queryData();
  }, []);

  const handleFilter = (e) => {
    const status = e.target.value;
    if (currentStatus === status) return;
    setCurrentStatus(status);
    queryData(status);
  };

  const handleDelete = async (id) => {
    try {
      setTableLoading(true);
      const { code } = await deleteTask(id);
      if (code === "0") {
        queryData();
        message.success("删除成功！");
      } else {
        message.error("删除失败！");
      }
    } catch {
      /* empty */
    }
  };

  const handleComplete = async (id) => {
    try {
      setTableLoading(true);
      const { code } = await completeTask(id);
      if (code === "0") {
        queryData();
        message.success("操作成功！");
      } else {
        message.error("操作失败！");
      }
    } catch {
      /* empty */
    }
  };

  const handleSave = async () => {
    try {
      await formRef.current.validateFields();
      let { task, time } = formRef.current.getFieldsValue();
      time = time.format("YYYY-MM-DD HH:mm:ss");
      setConfirmLoading(true);
      console.log("submit:", task, time);
      const { code } = await addTask(task, time);
      if (code === "0") {
        setModalShow(false);
        queryData();
        message.success("添加成功");
      } else {
        message.error("添加失败");
      }
    } catch (e) {
      console.error(e);
    }
    setConfirmLoading(false);
  };

  const handleOpenModal = () => {
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
  };

  const columns = [
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
      render: (status) => (status === 1 ? "未完成" : "已完成"),
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
              onConfirm={handleDelete.bind(null, id)}
            >
              <Button type="link">删除</Button>
            </Popconfirm>
            {status !== 0 ? (
              <Popconfirm
                title="您确把此任务设置为完成吗？"
                onConfirm={handleComplete.bind(null, id)}
              >
                <Button type="link">完成</Button>
              </Popconfirm>
            ) : null}
          </>
        );
      },
    },
  ];

  return (
    <div className="container">
      <header className="header">
        <div className="title">
          <h2 className="title__text">TASK OA 任务管理系统</h2>
          <Button type="primary" onClick={handleOpenModal}>
            新增任务
          </Button>
        </div>

        {/* 筛选 */}
        <div className="tags">
          <Radio.Group
            defaultValue=""
            buttonStyle="solid"
            onChange={handleFilter}
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
          columns={columns}
          tableLoading={tableLoading}
          pagination={false}
          rowKey="id"
        />
      </main>

      {/* 弹窗 */}
      <Modal
        title="新增任务"
        open={modalShow}
        confirmLoading={confirmLoading}
        keyboard={false}
        maskClosable={false}
        okText="提交"
        onCancel={handleCloseModal}
        onOk={handleSave}
      >
        <Form
          ref={formRef}
          layout="vertical"
          initialValues={{ task: "", time: "" }}
        >
          <Form.Item
            label="任务描述"
            name="task"
            validateTrigger="onBlur"
            rules={[
              { required: true, message: "任务描述是必填项" },
              { min: 6, message: "输入的内容至少6位及以上" },
            ]}
          >
            <Input.TextArea rows={4}></Input.TextArea>
          </Form.Item>
          <Form.Item
            label="预期完成时间"
            name="time"
            validateTrigger="onBlur"
            rules={[{ required: true, message: "预期完成时间是必填项" }]}
          >
            <DatePicker showTime />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
