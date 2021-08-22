import React, { useEffect, useRef, useState } from "react";
import { auth, db, servers } from "../../firebase";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import AgreeCall from "../../components/AgreeCall";

function Call({ friendId }) {
  const videoRef = useRef(null);
  const videoStreamRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [pc, setPc] = useState(null);

  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [notificationCall, setNotificationCall] = useState({
    text: "Từ chối",
    status: false,
  });
  const [createCallText, setCreateCallText] = useState({
    text: "Tạo cuộc gọi",
    status: false,
  });

  const [user] = useAuthState(auth);

  useEffect(() => {
    const getData = async () => {
      if (user) {
        const cityRef = db.collection("users").doc(user.uid);
        const doc = await cityRef.get();
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          setUserData(doc.data());
          setUserId(doc.id);
        }
      }
    };
    getData();
  }, [user]);

  useEffect(() => {
    setPc(new RTCPeerConnection(servers));
    const getStrack = async () => {
      setLocalStream(
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
      );
      setRemoteStream(new MediaStream());
    };
    getStrack();
  }, []);

  const defaultSrcObject = () => {
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };
    videoRef.current.srcObject = localStream;
    videoStreamRef.current.srcObject = remoteStream;
  };

  const callButton = async () => {
    if (!createCallText.status) {
      if (userData) {
        setCreateCallText({
          text: "Đang kết nối...",
          status: false,
        });
        defaultSrcObject();
        const callDoc = db
          .collection("users")
          .doc(friendId)
          .collection("calls")
          .doc();
        const offerCandidates = callDoc.collection("offerCandidates");
        const answerCandidates = callDoc.collection("answerCandidates");

        pc.onicecandidate = (event) => {
          event.candidate && offerCandidates.add(event.candidate.toJSON());
        };
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

        const offer = {
          sdp: offerDescription.sdp,
          type: offerDescription.type,
        };

        await callDoc.set({
          offer,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          name: userData.surname.concat(" ", userData.name),
          image: userData.AvatarImage,
        });

        callDoc.onSnapshot((snapshot) => {
          const data = snapshot.data();
          if (!pc.currentRemoteDescription && data?.answer) {
            try {
              setCreateCallText({
                text: "kết nối thành công",
                status: false,
              });
              const answerDescription = new RTCSessionDescription(data.answer);
              pc.setRemoteDescription(answerDescription);
            } catch (error) {
              setCreateCallText({
                text: "Cuộc gọi bị từ chối",
                status: true,
              });
            }
          }
        });

        answerCandidates.onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const candidate = new RTCIceCandidate(change.doc.data());
              pc.addIceCandidate(candidate);
            }
          });
        });
      }
    } else {
      window.close();
    }
  };

  const answerButton = async (data) => {
    if (!notificationCall.status) {
      setNotificationCall({
        text: "Kết thúc cuộc gọi",
        status: true,
      });
      defaultSrcObject();
      if (userId) {
        const callId = data.docs[0].id;
        const callDoc = db
          .collection("users")
          .doc(userId)
          .collection("calls")
          .doc(callId);
        const answerCandidates = callDoc.collection("answerCandidates");
        const offerCandidates = callDoc.collection("offerCandidates");
  
        pc.onicecandidate = (event) => {
          event.candidate && answerCandidates.add(event.candidate.toJSON());
        };
  
        const callData = (await callDoc.get()).data();
  
        const offerDescription = callData.offer;
        await pc.setRemoteDescription(
          new RTCSessionDescription(offerDescription)
        );
  
        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);
  
        const answer = {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
        };
  
        await callDoc.update({ answer });
  
        offerCandidates.onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            console.log(change);
            if (change.type === "added") {
              let data = change.doc.data();
              pc.addIceCandidate(new RTCIceCandidate(data));
            }
          });
        });
      }
    } else {
      window.close();
    }
    
  };

  const refuseButton = async (data) => {
    if (userId) {
      const callId = data.docs[0].id;
      const callDoc = db
        .collection("users")
        .doc(userId)
        .collection("calls")
        .doc(callId);

      const answer = {
        type: true,
        sdp: true,
      };

      await callDoc.update({ answer });
      window.close();
    }
  };

  return (
    <div>
      <div className="text-center my-3">
        {userId && userId !== friendId && (
          <button
            onClick={callButton}
            className="bg-blue-500 text-[white] px-3 py-2 rounded-md "
          >
            {createCallText.text}
          </button>
        )}
        {userId && userId === friendId && (
          <div className="space-x-2">
            <span></span>
            <button className="bg-blue-500 text-[white] px-3 py-2 rounded-md ">
              <AgreeCall userId={userId} answerButton={answerButton}>
                Đồng ý
              </AgreeCall>
            </button>
            <button className="bg-red-300 text-[white] px-3 py-2 rounded-md ">
              <AgreeCall userId={userId} refuseButton={refuseButton}>
                {notificationCall.text}
              </AgreeCall>
            </button>
          </div>
        )}
      </div>

      <div style={{ margin: "0 auto" }} className=" w-[80vw] h-[43vw]">
        <div className="relative">
          <video
            className="w-full h-full"
            ref={videoRef}
            id="webcamVideo"
            autoPlay
            playsInline
          ></video>
          <video
            className="absolute bottom-[1rem] right-[1rem] w-[20vw] h-[25vw] "
            ref={videoStreamRef}
            id="remoteVideo"
            autoPlay
            playsInline
          ></video>
        </div>
      </div>
    </div>
  );
}

export default Call;

export async function getServerSideProps(context) {
  const uid = context.query.id;
  return {
    props: {
      friendId: uid,
    },
  };
}
