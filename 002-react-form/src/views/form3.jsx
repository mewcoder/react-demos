import React from "react";

import Form, { Field } from "@/components/rc-field-form/";

const nameRules = { required: true, message: "请输入姓名！" };
const passworRules = { required: true, message: "请输入密码！" };

export default class RCFieldForm extends React.Component {
  formRef = React.createRef();

  componentDidMount() {
    console.log("form", this.formRef.current); //sy-log
    this.formRef.current.setFieldsValue({ username: "default" });
  }

  onFinish = (val) => {
    console.log("onFinish", val); //sy-log
  };

  // 表单校验失败执行
  onFinishFailed = (val) => {
    console.log("onFinishFailed", val); //sy-log
  };
  render() {
    return (
      <div>
        <h3>RCFieldForm</h3>
        <Form
          ref={this.formRef}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Field name="username" rules={[nameRules]}>
            <input placeholder="Username" />
          </Field>
          <Field name="password" rules={[passworRules]}>
            <input placeholder="Password" />
          </Field>
          <button>Submit</button>
        </Form>
      </div>
    );
  }
}
