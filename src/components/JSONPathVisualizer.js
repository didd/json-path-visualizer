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

  const Main = ({ jsonObj }) =>
    isObj(jsonObj) && (
      <Fragment>
        {Object.keys(jsonObj).map((key, index) => (
          <Fragment>
            {jsonObj.hasOwnProperty(key) && (
              <SubTree
                jsonObj={jsonObj[key]}
                objKey={key}
                index={index}
                isArray={Array.isArray(jsonObj)}
              />
            )}
          </Fragment>
        ))}
      </Fragment>
    );

  const SubTree = ({ jsonObj, objKey, isArray }) => {
    let uiFragment = "";
    let newJsonObj = null;

    if (isObj(jsonObj)) {
      if (isArray) {
        newJsonObj = {};
        Object.keys(jsonObj)
          .filter((key, index) => index !== 0)
          .forEach((key, index) => {
            newJsonObj = { [key]: jsonObj[key], ...newJsonObj };
          });
        uiFragment = (
          <Fragment>
            <li>
              <i className="minus" onClick={() => onSubTreeClicked(objKey)}>
                {selectedKeys.includes(objKey) ? "+" : "-"}
              </i>{" "}
              {`${Object.keys(jsonObj)[0]}: ${
                jsonObj[Object.keys(jsonObj)[0]]
              }`}
              <ul className="sub-tree">
                <Main jsonObj={newJsonObj}></Main>
              </ul>
            </li>
          </Fragment>
        );
      } else {
        uiFragment = (
          <Fragment>
            <li>
              <i className="minus" onClick={() => onSubTreeClicked(objKey)}>
                {selectedKeys.includes(objKey) ? "+" : "-"}
              </i>{" "}
              {objKey}
              <ul className="sub-tree">
                <Main jsonObj={newJsonObj ? newJsonObj : jsonObj}></Main>
              </ul>
            </li>
          </Fragment>
        );
      }
    } else {
      uiFragment = (
        <Fragment>
          <li>
            {`${objKey}: ${jsonObj}`}
            <Main jsonObj={newJsonObj ? newJsonObj : jsonObj}></Main>
          </li>
        </Fragment>
      );
    }
    return uiFragment;
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
