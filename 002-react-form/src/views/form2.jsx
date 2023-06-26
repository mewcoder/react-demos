import React, { Component } from "react";
import { Form, Button, Input } from "antd";

const nameRules = { required: true, message: "请输入姓名！" };
const passworRules = { required: true, message: "请输入密码！" };

export default class AntdFormPage extends Component {
  formRef = React.createRef();

  componentDidMount() {
    this.formRef.current.setFieldsValue({ username: "defalut" });
  }
  onFinish = (val) => {
    console.log("onFinish", val);
  };
  onFinishFailed = (val) => {
    console.log("onFinishFailed", val);
  };
  render() {
    return (
      <div>
        <h3>AntdFormPage</h3>
        <Form
          ref={this.formRef}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item name="username" label="姓名" rules={[nameRules]}>
            <Input placeholder="username placeholder" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[passworRules]}>
            <Input placeholder="password placeholder" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" size="large" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
