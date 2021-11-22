const Card = (props) => {
  const classes =
    "rounded-lg overflow-hidden shadow-lg bg-white " + props.className;
  return <div className={classes}>{props.children}</div>;
};

export default Card;
