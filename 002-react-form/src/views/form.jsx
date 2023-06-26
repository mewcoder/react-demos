import React from "react";

import createForm from "@/components/rc-form";

const nameRules = { required: true, message: "请输入姓名！" };
const passwordRules = { required: true, message: "请输入密码！" };

class Form extends React.Component {
  componentDidMount() {
    console.log("--componentDidMount");
    this.props.form.setFieldsValue({ username: "123", password: "456" });
  }

  submit = () => {
    const { getFieldsValue, validateFields } = this.props.form;
    console.log("submit", getFieldsValue());
    validateFields((err, val) => {
      if (err) {
        console.log("err", err);
        alert(JSON.stringify(err));
      } else {
        console.log("校验成功", val);
      }
    });
  };

  render() {
    console.log("render");
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <h3>Form</h3>
        {getFieldDecorator("username", { rules: [nameRules] })(
          <input placeholder="Username" />
        )}
        {getFieldDecorator("password", { rules: [passwordRules] })(
          <input placeholder="Password" />
        )}
        <button onClick={this.submit}>submit</button>
      </div>
    );
  }
}

const RcForm = createForm(Form);

export default RcForm;
