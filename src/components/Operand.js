import classes from "./operand.module.css";

const Operand = ({ char, elementState }) => {
    const dragStartHandler = (e) => {
        e.target.classList.add("dragging");
    };

    const dragEndHandler = (e) => {
        e.target.classList.remove("dragging");
        elementState();
    };

    return (
        <div
            className={`${classes.operandBox} draggable`}
            draggable={true}
            onDragStart={dragStartHandler}
            onDragEnd={dragEndHandler}
        >
            <p>{char}</p>
        </div>
    );
};

export default Operand;
