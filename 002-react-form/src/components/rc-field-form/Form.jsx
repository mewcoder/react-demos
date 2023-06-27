import { useImperativeHandle } from "react";
import FieldContext from "./FieldContext";
import useForm from "./useForm";

export default function Form(props, ref) {
  const { children, form, onFinish, onFinishFailed } = props;

  const [formInstance] = useForm(form);

  useImperativeHandle(ref, () => formInstance);

  formInstance.setCallbacks({
    onFinish,
    onFinishFailed,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        formInstance.submit();
      }}
    >
      <FieldContext.Provider value={formInstance}>
        {children}
      </FieldContext.Provider>
    </form>
  );
}
