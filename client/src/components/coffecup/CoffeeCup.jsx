import { animated, useSpring } from "@react-spring/web";

const CoffeeCup = ({ progress }) => {
  const styles = useSpring({
    height: `${progress}%`,
    from: { height: "0%" },
  });

  return (
    <div className="spring-coffee-cup" style={{ position: "relative", width: 60, height: 100, border: "1px solid #000" }}>
      <animated.div
        style={{
          ...styles,
          background: "#6f4e37",
          width: "100%",
          position: "absolute",
          bottom: 0,
        }}
      />
    </div>
  );
};


export default CoffeeCup;
