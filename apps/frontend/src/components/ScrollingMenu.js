import React from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";

const ScrollingMenu = (props) => {
  return (
    <ScrollMenu
      options={{
        ratio: 0.9,
        rootMargin: "5px",
        threshold: [0.01, 0.05, 0.5, 0.75, 0.95, 1],
      }}
      LeftArrow={LeftArrow}
      RightArrow={RightArrow}
    >
      {props.items}
    </ScrollMenu>
  );
};

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } =
    React.useContext(VisibilityContext);

  return (
    // <div
    //   className="columns is-vcentered"
    //   disabled={isFirstItemVisible}
    //   onClick={() => scrollPrev()}
    // >
    <div
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={process.env.PUBLIC_URL + "/images/Atras.png"}
        alt="adelante"
        style={{ cursor: "pointer" }}
      />
    </div>
    // </div>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

  return (
    // <div
    //   className="columns is-vcentered"
    //   disabled={isLastItemVisible}
    //   onClick={() => scrollNext()}
    // >
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
    >
      <img
        src={process.env.PUBLIC_URL + "/images/Adelante.png"}
        alt="adelante"
        style={{ cursor: "pointer" }}
      />
    </div>
    // </div>
  );
}

export default ScrollingMenu;
