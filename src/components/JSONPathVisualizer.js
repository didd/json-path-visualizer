import React, { Fragment, useState, useRef } from "react";

import "./JSONPathVisualizer.css";

const JSONPathVisualizer = () => {
  const inputUploadFile = useRef(null);

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [jsonObj, setJsonObj] = useState({});

  const traverse = (obj) => {
    if (!Array.isArray(obj) && typeof obj === "object" && obj !== null) {
      Object.keys(obj).forEach((key) => {
        console.log(key, obj);
        if (obj.hasOwnProperty(key)) {
          traverse(obj[key]);
        }
      });
    }
  };

  const isObj = (obj) => typeof obj === "object" && obj !== null;

  const Tree = ({ jsonObj }) => (
    <Fragment>
      <ul className="tree">
        <Main jsonObj={jsonObj} />
      </ul>
    </Fragment>
  );

  const Main = ({ jsonObj }) => (
    <Fragment>
      {isObj(jsonObj) && (
        <li>
          {Object.keys(jsonObj).map((key, index) => (
            <Fragment>
              {jsonObj.hasOwnProperty(key) && (
                <SubTree jsonObj={jsonObj[key]} objKey={key} index={index} />
              )}
            </Fragment>
          ))}
        </li>
      )}
    </Fragment>
  );

  const SubTree = ({ jsonObj, objKey }) => {
    let uiFragment = "";

    if (isObj(jsonObj)) {
      uiFragment = (
        <Fragment>
          <i className="minus" onClick={() => onSubTreeClicked(objKey)}>
            {selectedKeys.includes(objKey) ? "+" : "-"}
          </i>{" "}
          {objKey}
        </Fragment>
      );
    } else {
      uiFragment = `${objKey}: ${jsonObj}`;
    }
    return (
      <Fragment>
        {uiFragment}
        <ul
          className="sub-tree"
          style={{ display: selectedKeys.includes(objKey) ? "none" : "block" }}
        >
          <Main jsonObj={jsonObj}></Main>
        </ul>
      </Fragment>
    );
  };

  const onSubTreeClicked = (objKey) => {
    setSelectedKeys([objKey, ...selectedKeys]);
  };

  const onFileUpload = (event) => {
    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      let parsedObj = JSON.parse(reader.result);
      setJsonObj(parsedObj);
    };
    reader.readAsText(event.target.files[0]);
  };

  return (
    <Fragment>
      <input type="text" className="input" />
      <div className="tree-view">
        <Tree jsonObj={jsonObj} />
        <input
          ref={inputUploadFile}
          type="file"
          accept=".json"
          onChange={onFileUpload}
          style={{ display: "none" }}
        ></input>
        <button
          onClick={() => {
            if (inputUploadFile) {
              inputUploadFile.current.click();
            }
          }}
          className="button"
        >
          Upoad JSON
        </button>
      </div>
    </Fragment>
  );
};

export default JSONPathVisualizer;
