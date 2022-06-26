import React from "react";
import { H1, H2, P, Button, BodyWrapper } from "../components";
import { withRouter } from "react-router-dom";

const Lander = (props) => {
  const signIn = () => {
    props.history.push("/signin");
  };

  return (
    <BodyWrapper>
      <H1>EcoPay</H1>
      <H2>Hi there! 👋</H2>
      <P>
        <li>
          The main objective of the project is to promote recycling and improve
          solid waste management.
        </li>
        <li>
          Encourage people to recycle waste by rewarding them with credits.{" "}
        </li>
        <li>
          In the smart recycle bin, we have a process of identifying wastes into
          different classes that are plastic, paper and trash (Here trash is
          unrecognised waste or other than plastic and paper) with the help of
          ML models built for identifying based on the training data.
        </li>
        <li>
          Our project can be implemented in several places to help improve the
          way of life
        </li>
        <li>A. Waste Detection Scenario and Accuracy calculation</li>
        <li>
          Basic security rules have already been written for the Firestore DB.
        </li>

        <li>Dark Mode! You gotta have dark mode!</li>
      </P>
      <Button onClick={signIn}>Take a Tour</Button>
    </BodyWrapper>
  );
};

export default withRouter(Lander);
