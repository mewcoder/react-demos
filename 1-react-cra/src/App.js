import "./App.css";
import DemoOne from "./components/DemoOne";
import Dialog from "./components/Dialog";

function App() {
  return (
    <>
      <div className="App">
        <DemoOne
          title="DemoOne"
          x={9999}
          style={{
            color: "red",
          }}
        />
      </div>
      <Dialog title="对话框" content="我是对话框"></Dialog>
    </>
  );
}

export default App;
