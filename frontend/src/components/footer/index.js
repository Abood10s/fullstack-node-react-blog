import React from "react";
const Footer = () => {
  return (
    <footer style={styles}>Copyright 2023 Abdulrahman Saafeen &copy;</footer>
  );
};
const styles = {
  color: "var(--white-color)",
  fontSize: "21px",
  backgroundColor: "var(--blue-color)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "50px",
  textAlign: "center",
};
export default Footer;
