const MoveButton = (props) => {
  return (
    <button className="btn ml-0" onClick={props.onClick}>
      {props.children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 ml-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={props.d}
        />
      </svg>
    </button>
  );
};

export default MoveButton;
