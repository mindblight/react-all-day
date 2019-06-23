import * as Bluebird from "bluebird";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { AsyncResult } from "./async/AsyncResult";
import { actionCreators } from "./redux/actions/counter";
import { getCount } from "./redux/selectors";

export default function App() {
  // Challenge 1
  const count = useSelector(getCount);
  const dispatch = useDispatch();
  const handleIncrement = React.useCallback(() => {
    dispatch(actionCreators.increment(count));
  }, [dispatch, count]);

  // Challenge 2
  const [countResult, incrementAsync] = asyncIncrement();

  if (countResult.status === "pending") {
    return <span>Loading...</span>;
  } else if (countResult.status === "error") {
    return <span>Error!</span>;
  }

  return (
    <>
      <section className="hero is-primary">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Counter App</h1>
          </div>
        </div>
      </section>
      <section className="container">
        <div className="level">
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Counter</p>
              <p className="title">{count}</p>
            </div>
          </div>
        </div>
        {/* Challenge 5: <div className="notification is-danger" /> */}
        <div className="field is-grouped">
          <p className="control">
            <button
              className="button"
              id="increment-btn"
              onClick={handleIncrement}
            >
              Click to increment
            </button>
          </p>
          <p className="control">
            <button className="button" id="delay-increment-btn">
              Click to increment slowly
            </button>
          </p>
          <p className="control">
            <button className="button" id="remote-fetch-btn">
              Click to fetch server-side
            </button>
          </p>
        </div>
      </section>
    </>
  );
}

function asyncIncrement(): [AsyncResult<number>, (amount?: number) => void] {
  const dispatch = useDispatch();
  const [status, setStatus] = React.useState<AsyncResult<number>["status"]>(
    "pending"
  );

  const increment = React.useCallback(
    (amount: number = 1) => {
      // TODO: Add cancellation. Multiple calls to this method could cause race condition if async time varies
      Bluebird.delay(1000)
        .then(() => {
          dispatch(increment(amount));
          setStatus("success");
        })
        .catch(() => setStatus("error"));
    },
    [setStatus, dispatch]
  );

  return [
    {
      status,
      data: useSelector(getCount)
    },
    increment
  ];
}
