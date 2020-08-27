import React, { Fragment, useState, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusSquare } from "@fortawesome/free-solid-svg-icons";

import "./JSONPathVisualizer.css";

const JSONPathVisualizer = () => {
  const inputUploadFile = useRef(null);
  const subTree = useRef([]);

  const [jsonObj, setJsonObj] = useState({});
  let currentIndex = 0;

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
        {Object.keys(jsonObj).map((key) => {
          currentIndex += 1;
          return (
            <Fragment>
              {jsonObj.hasOwnProperty(key) && (
                <SubTree
                  jsonObj={jsonObj[key]}
                  objKey={key}
                  currentIndex={currentIndex}
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

    console.log(currentIndex);

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
              <span className="plus-minus" onClick={onSubTreeClicked}>
                <FontAwesomeIcon icon={faMinusSquare} />
              </span>
              {`${Object.keys(jsonObj)[0]}: ${
                jsonObj[Object.keys(jsonObj)[0]]
              }`}
              <ul className="sub-tree" ref={subTree.current[currentIndex - 1]}>
                <Main jsonObj={newJsonObj}></Main>
              </ul>
            </li>
          </Fragment>
        );
      } else {
        uiFragment = (
          <Fragment>
            <li>
              <span className="plus-minus" onClick={onSubTreeClicked}>
                <FontAwesomeIcon icon={faMinusSquare} />
              </span>
              {objKey}
              <ul className="sub-tree" ref={subTree.current[currentIndex - 1]}>
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

  const onSubTreeClicked = (event) => {
    console.log(subTree.current[0]);
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
