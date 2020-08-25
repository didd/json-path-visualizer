import React, { Suspense, lazy, Fragment } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import ResizeDetector from "react-resize-detector";
import Loader from "react-loaders";

import "./App.css";

const JSONPathVisualizer = lazy(() =>
  import("./components/JSONPathVisualizer")
);

function App() {
  return (
    <ResizeDetector
      handleWidth
      render={({ width }) => (
        <Fragment>
          <div className="wrapper" style={{ margin: "40px" }}>
            <Suspense
              fallback={
                <div className="loader-container">
                  <div className="loader-container__inner">
                    <div style={{ textAlign: "center" }}>
                      <Loader type="ball-grid-cy" />
                    </div>
                    <h4>Loading ...</h4>
                  </div>
                </div>
              }
            >
              <Router>
                <Route path="*" component={JSONPathVisualizer} />
              </Router>
            </Suspense>
          </div>
        </Fragment>
      )}
    />
  );
}
export default App;
