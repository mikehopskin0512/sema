import { useState } from "react";
import { InputField } from "./lib";

function App() {
  const [inputFieldValue, setInputFieldValue] = useState("test value");
  return (
    <div className="App aui-column">
      <label className="aui-label">Simple storybook can be here</label>

      <div className="aui-column aui-is-4-widescreen">
        <div className="aui-mb-24">
          <InputField
            title="regular input field"
            value={inputFieldValue}
            onChange={setInputFieldValue}
          />
        </div>
        <div className="aui-mb-24">
          <InputField
            title="required input field with error"
            value={inputFieldValue}
            onChange={setInputFieldValue}
            error="error text"
            isRequired
          />
        </div>
      </div>
    </div>
  );
}

export default App;
