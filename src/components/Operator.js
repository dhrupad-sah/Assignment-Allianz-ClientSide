import classes from "./operator.module.css";

const Operator = ({ operator, dragable = true, elementState }) => {
    const clickHandler = (e) => {
        const draggableArea = document.querySelector(".draggableArea");
        let draggableClone;
        if (e.target.innerText === "RHS Integer") {
            const num = prompt("Enter the no.");
            draggableClone = e.target.cloneNode(true);
            draggableClone.innerText = num;
        } else {
            draggableClone = e.target.cloneNode(true);
        }
        const close = document.createElement("div");
        close.classList.add("close");
        close.addEventListener("click", (e) => {
            e.target.parentElement.parentElement.removeChild(
                e.target.parentElement
            );
        });
        draggableClone.appendChild(close);
        draggableArea.appendChild(draggableClone);
    };

    let classValue = classes.operatorBox;
    if (dragable) {
        classValue += " draggable";
    }

    const dragStartHandler = (e) => {
        e.target.classList.add("dragging");
    };

    const dragEndHandler = (e) => {
        e.target.classList.remove("dragging");
        elementState();
    };

    return (
        <div
            className={classValue}
            onDoubleClick={dragable ? null : clickHandler}
            draggable={dragable}
            onDragStart={dragStartHandler}
            onDragEnd={dragEndHandler}
        >
            {operator}
        </div>
    );
};

export default Operator;
