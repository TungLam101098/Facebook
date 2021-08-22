import React from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

function AgreeCall({ userId, answerButton, children, refuseButton }) {
  const [realtimeCall] = useCollection(
    db
      .collection("users")
      .doc(userId)
      .collection("calls")
      .orderBy("timestamp", "desc")
  );
  const addEvent = () => {
    if (answerButton) {
      answerButton(realtimeCall);
    }
    if (refuseButton) {
      refuseButton(realtimeCall);
    }
  };
  return <div onClick={addEvent}>{children}</div>;
}

export default AgreeCall;
