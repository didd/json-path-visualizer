import React, { Fragment, useState, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusSquare, faPlusSquare } from "@fortawesome/free-solid-svg-icons";

import "./JSONPathVisualizer.css";

const jp = require("jsonpath");
const deepEqual = require("fast-deep-equal");

const JSONPathVisualizer = () => {
  const inputUploadFile = useRef(null);

  const [jsonObj, setJsonObj] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [tree, setTree] = useState([]);
  const [message, setMessage] = useState("");

  let currentIndex = 0;

  const isObj = (obj) => typeof obj === "object" && obj !== null;

  const matchFound = (objKey, jsonObj) => {
    let hasMatch = false;
    for (let node of nodes) {
      if (
        node.path[node.path.length - 1].toString() === objKey.toString() &&
        deepEqual(node.value, jsonObj)
      ) {
        hasMatch = true;
        break;
      }
    }
    return hasMatch;
  };

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
        {Object.keys(jsonObj).map((key, index) => {
          return (
            <Fragment key={`${key}-${index}`}>
              {jsonObj.hasOwnProperty(key) && (
                <SubTree
                  jsonObj={jsonObj[key]}
                  objKey={key}
                  currentIndex={currentIndex++}
                  isArray={Array.isArray(jsonObj)}
                />
              )}
            </Fragment>
          );
        })}
      </Fragment>
    );

  const SubTree = ({ jsonObj, objKey, isArray, currentIndex }) => {
    let uiFragment = "";
    let newJsonObj = null;
    let displayStyle = { display: "block" };
    let highlightStyle = {};
    let icon = faMinusSquare;

    if (matchFound(objKey, jsonObj)) {
      highlightStyle = { color: "#F44336" };
    }
    if (isObj(jsonObj)) {
      if (isObj(tree[currentIndex])) {
        if (!tree[currentIndex].show) {
          displayStyle = { display: "none" };
          icon = faPlusSquare;
        }
      }
      if (isArray) {
        newJsonObj = {};
        Object.keys(jsonObj)
          .filter((key, index) => index !== 0)
          .forEach((key, index) => {
            newJsonObj = { [key]: jsonObj[key], ...newJsonObj };
          });
        uiFragment = (
          <Fragment>
            <li style={{ ...highlightStyle }}>
              <span
                className="plus-minus"
                onClick={() => showTree(currentIndex)}
                style={{ color: "#000" }}
              >
                <FontAwesomeIcon icon={icon} />
              </span>
              {`${Object.keys(jsonObj)[0]}: ${
                jsonObj[Object.keys(jsonObj)[0]]
              }`}
              <ul className="sub-tree" style={{ ...displayStyle }}>
                <Main jsonObj={newJsonObj}></Main>
              </ul>
            </li>
          </Fragment>
        );
      } else {
        uiFragment = (
          <Fragment>
            <li style={{ ...highlightStyle }}>
              <span
                className="plus-minus"
                onClick={() => showTree(currentIndex)}
                style={{ color: "#000" }}
              >
                <FontAwesomeIcon icon={icon} />
              </span>
              {objKey}
              <ul className="sub-tree" style={{ ...displayStyle }}>
                <Main jsonObj={newJsonObj ? newJsonObj : jsonObj}></Main>
              </ul>
            </li>
          </Fragment>
        );
      }
    } else {
      uiFragment = (
        <Fragment>
          <li style={highlightStyle}>
            {`${objKey}: ${jsonObj}`}
            <Main jsonObj={newJsonObj ? newJsonObj : jsonObj}></Main>
          </li>
        </Fragment>
      );
    }
    return uiFragment;
  };

  const showTree = (currentIndex) => {
    let _tree = [...tree];
    _tree[currentIndex] = {
      show: _tree[currentIndex] && !_tree[currentIndex].show,
    };
    setTree(_tree);
  };

  const onFileUpload = (event) => {
    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      try {
        let parsedObj = JSON.parse(reader.result);
        setMessage("");
        setJsonObj(parsedObj);
      } catch {
        console.error("Unable to parse json file!");
        setMessage("Unable to parse json file!");
      }
    };
    reader.readAsText(event.target.files[0]);
  };

  const search = (event) => {
    if (event.key === "Enter") {
      if (jsonObj && event.target.value.charAt(0) === "$") {
        setNodes(jp.nodes(jsonObj, event.target.value));
      } else {
        setNodes([]);
      }
    }
  };

  return (
    <Fragment>
      <input
        type="text"
        className="input"
        placeholder="Expression"
        onKeyUp={search}
      />
      <div className="tree-view">
        <div
          style={{
            minHeight: "400px",
            maxHeight: "400px",
            overflow: "auto",
            margin: "15px 0",
            background: "#fff",
            padding: "10px",
          }}
        >
          {message ? message : <Tree jsonObj={jsonObj} />}{" "}
        </div>
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
