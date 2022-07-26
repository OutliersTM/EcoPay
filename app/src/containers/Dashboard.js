import React, { useState, useContext, useEffect, useCallback } from "react";
import { P, H1, Button, Input, Form, BodyWrapper, H2 } from "../components";
import { UserContext } from "../contexts/userContext";
import { ToastContext } from "../contexts/toastContext";
import firebase from "../firebase.js";
import "firebase/firestore";
import ButtonWithLoadState from "../components/Button";
import Card from "../components/Card";
import plastic from "../themes/icons/plastic_480.png";
import metal from "../themes/icons/metal_400px.png";
import paper from "../themes/icons/paper.png";
import cardboard from "../themes/icons/cardboard_box_480px.png";
import glass from "../themes/icons/fragile_480px.png";
import Flexrow from "../components/Flexrow";
import Grid from "../components/Grid";
import trash from "../themes/icons/trash_480px.png";
import HorizontalScroll from "react-horizontal-scrolling";
import ButtonOutlined from "../components/ButtonOutlined";
const Dashboard = () => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [moreInfoComplete, setMoreInfoComplete] = useState(false);
  const { userState, userDispatch } = useContext(UserContext);
  const { sendMessage } = useContext(ToastContext);
  const [wastes, setWastes] = useState([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const db = firebase.firestore();
  const [categories, setCategories] = useState({
    plastic: 0,
    metal: 0,
    cardboard: 0,
    glass: 0,
    trash: 0,
    paper: 0,
  });
  const [images, setImages] = useState({
    plastic: [],
    metal: [],
    cardboard: [],
    glass: [],
    trash: [],
    paper: [],
  });

  useEffect(() => {
    if (
      (moreInfoComplete || userState.userData.firstName) &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      requestNotifications();
    }
  }, []);

  const getFucn = useCallback(async () => {
    const temp = [];
    const d = await db
      .collection("users")
      .doc(userState.userId)
      .collection("wastes")
      .orderBy("timestamp", "asc")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          temp.push(doc.data());
        });
      });

    setWastes(temp);
    setTotalRewards((pr) => {
      let total = 0;
      temp.forEach((waste) => {
        let c = parseFloat(waste.reward);
        total += c;
      });
      return total.toFixed(2);
    });
    let cat = {
      plastic: 0,
      metal: 0,
      cardboard: 0,
      glass: 0,
      trash: 0,
      paper: 0,
    };
    let im = {
      plastic: [],
      metal: [],
      cardboard: [],
      glass: [],
      trash: [],
      paper: [],
    };
    temp.forEach((waste) => {
      let m = waste.material;
      let c = parseFloat(waste.reward);
      cat[m] += c;
    });
    setCategories(cat);
  }, [userState.userId]);

  useEffect(() => {
    getFucn();
  }, [getFucn]);

  const requestNotifications = () => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const messaging = firebase.messaging();
        messaging
          .getToken()
          .then((currentToken) => {
            db.collection("users")
              .doc(firebase.auth().currentUser.uid)
              .set({ pushTokenWeb: currentToken }, { merge: true })
              .then(() => {
                sendMessage("Notifications activated!");
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => {
            console.log("An error occurred while retrieving token.", err);
          });
      }
    });
  };

  const onClickSubmit = (e) => {
    e.preventDefault();
    if (firstName && lastName) {
      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .set(
          {
            firstName: firstName,
            lastName: lastName,
          },
          { merge: true }
        )
        .then(() => {
          userDispatch({
            type: "updateProfile",
            payload: {
              firstName: firstName,
              lastName: lastName,
            },
          });
          setMoreInfoComplete(true);
          sendMessage("Welcome!");
          requestNotifications();
        });
    } else {
      sendMessage("Please complete the form.");
    }
  };

  const moreInfo = () => {
    return (
      <BodyWrapper>
        <H1>Onboarding</H1>
        <P>
          This is an introduction screen that shows up after the user
          successfully logs in for the first time. It's a good opportunity to
          collect additional information or provide them with important details
          about how your application works.
        </P>
        <Form>
          <div>
            <Input
              onChange={(e) => setFirstName(e.target.value)}
              name="firstName"
              placeholder="First name"
              autoComplete="given-name"
            />
          </div>
          <div>
            <Input
              onChange={(e) => setLastName(e.target.value)}
              name="lastName"
              placeholder="Last name"
              autoComplete="family-name"
            />
          </div>
          <Button onClick={(e) => onClickSubmit(e)}>Submit</Button>
        </Form>
      </BodyWrapper>
    );
  };

  const dashboard = () => {
    return (
      <BodyWrapper>
        <H1>Dashboard</H1>

        <H2>Wallet : ₹{String(totalRewards).replace("NaN", "")}</H2>
        <H2>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <strong>Categories</strong>
            <ButtonWithLoadState>Withdraw From Wallet</ButtonWithLoadState>
          </div>
        </H2>

        <br />
        <br />
        <Grid>
          {Object.keys(categories).map((key) => {
            return (
              <Card>
                <img
                  src={
                    key === "plastic"
                      ? plastic
                      : key === "metal"
                      ? metal
                      : key === "cardboard"
                      ? cardboard
                      : key === "glass"
                      ? glass
                      : key === "paper"
                      ? paper
                      : key === "trash"
                      ? trash
                      : null
                  }
                  width={"55%"}
                  height={"auto"}
                />
                <Flexrow>
                  <H2>{key}</H2>
                  <H2>₹{categories[key].toFixed(2)}</H2>
                </Flexrow>
              </Card>
            );
          })}
        </Grid>
        <H1>Images</H1>

        <Grid>
          {wastes.map((key) => 
               <Card>
               <img
                 alt="waste"
                 src={key.image}
                 width={"100%"}
                 height={"auto"}
                 style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
               />
             </Card>
          )}
        </Grid>
      </BodyWrapper>
    );
  };
  return moreInfoComplete || userState.userData.firstName
    ? dashboard()
    : moreInfo();
};

export default Dashboard;
