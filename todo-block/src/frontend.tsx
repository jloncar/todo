import React from "react";
import ReactDOM from "react-dom";
import ToDoFrontendComponent from "./frontend.component";

const wrapper = document.querySelector(".todo-fe-wrapper");
if (wrapper) {
  ReactDOM.render(<ToDoFrontendComponent />, wrapper);
}
