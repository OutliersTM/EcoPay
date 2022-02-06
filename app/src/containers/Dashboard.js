import React, { useState, useContext, useEffect } from "react";
import { P, H1, Button, Input, Form, BodyWrapper, H2 } from "../components";
import { UserContext } from "../contexts/userContext";
import { ToastContext } from "../contexts/toastContext";
import firebase from "../firebase.js";
import "firebase/firestore";
import ButtonWithLoadState from "../components/Button";
import Card from "../components/Card";
import plastic from "../themes/icons/plastic_480.png";
import metal from "../themes/icons/metal_400px.png";
import cardboard from "../themes/icons/cardboard_box_480px.png";
import glass from "../themes/icons/fragile_480px.png";
import Flexrow from "../components/Flexrow";
import Grid from "../components/Grid";
import trash from "../themes/icons/trash_480px.png";
import ButtonOutlined from "../components/ButtonOutlined";
const Dashboard = () => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [moreInfoComplete, setMoreInfoComplete] = useState(false);
  const { userState, userDispatch } = useContext(UserContext);
  const { sendMessage } = useContext(ToastContext);
  const db = firebase.firestore();

  useEffect(() => {
    if (
      (moreInfoComplete || userState.userData.firstName) &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      requestNotifications();
    }
  }, []);

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
        <H2>Wallet : ₹1550</H2>
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <ButtonOutlined>Daily</ButtonOutlined>
          <ButtonOutlined>Weekly</ButtonOutlined>
          <ButtonOutlined>Monthly</ButtonOutlined>
        </div>
        <br />
        <br />
        <Grid>
          <Card>
            <img src={plastic} width={"55%"} height={"auto"} />
            <Flexrow>
              <H2>Plastic</H2>
              <H2>₹200</H2>
            </Flexrow>
          </Card>
          <Card>
            <img src={metal} width={"55%"} height={"auto"} />
            <Flexrow>
              <H2>Metal</H2>
              <H2>₹700</H2>
            </Flexrow>
          </Card>
          <Card>
            <img src={cardboard} width={"55%"} height={"auto"} />
            <Flexrow>
              <H2>Cardboard</H2>
              <H2>₹100</H2>
            </Flexrow>
          </Card>
          <Card>
            <img src={glass} width={"55%"} height={"auto"} />
            <Flexrow>
              <H2>Glass</H2>
              <H2>₹100</H2>
            </Flexrow>
          </Card>
          <Card>
            <img src={trash} width={"55%"} height={"auto"} />
            <Flexrow>
              <H2>Trash</H2>
              <H2>₹450</H2>
            </Flexrow>
          </Card>
        </Grid>
      </BodyWrapper>
    );
  };
  return moreInfoComplete || userState.userData.firstName
    ? dashboard()
    : moreInfo();
};

export default Dashboard;
