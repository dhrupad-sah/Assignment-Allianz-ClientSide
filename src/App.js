import "./App.css";
import Operand from "./components/Operand";
import Operator from "./components/Operator";
import { useState } from "react";

function App() {
    const [stoppedDragging, setStoppedDragging] = useState(true);

    const dropElement = () => {
        setStoppedDragging(true);
    };

    const elementDropped = (draggable, afterElement) => {
        const draggableArea = document.querySelector(".draggableArea");
        const draggableClone = draggable.cloneNode(true);
        draggableClone.setAttribute("draggable", false);
        draggableClone.classList.remove("draggable");
        const close = document.createElement("div");
        close.classList.add("close");
        close.addEventListener("click", (e) => {
            e.target.parentElement.parentElement.removeChild(
                e.target.parentElement
            );
        });
        draggableClone.classList.remove("dragging");
        draggableClone.appendChild(close);
        if (afterElement === undefined) {
            draggableArea.appendChild(draggableClone);
        } else {
            draggableArea.insertBefore(draggableClone, afterElement);
        }
        setStoppedDragging(false);
    };

    const getDragAfterElement = (container, x) => {
        const draggableElements = [...container.querySelectorAll("div")];

        return draggableElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = x - box.left - box.width / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY }
        ).element;
    };

    const dragOverHandler = (e) => {
        e.preventDefault();
        const draggableArea = document.querySelector(".draggableArea");
        const afterElement = getDragAfterElement(draggableArea, e.clientX);
        const draggable = document.querySelector(".dragging");

        if (stoppedDragging) {
            elementDropped(draggable, afterElement);
        }
    };

    const calculateHandler = async () => {
        const draggableArea = document.querySelector(".draggableArea");
        const expression = [];
        if (draggableArea.childNodes.length < 2) {
            prompt("Enter valid expression!");
            return;
        }
        for (let i = 0; i < draggableArea.childNodes.length - 2; i++) {
            expression[i] = draggableArea.childNodes[i].innerText;
        }

        const comparator =
            draggableArea.childNodes[draggableArea.childNodes.length - 2]
                .innerText;
        const rhsInt = parseInt(
            draggableArea.childNodes[draggableArea.childNodes.length - 1]
                .innerText
        );

        if (
            comparator !== ">" &&
            comparator !== "<" &&
            !Number.isInteger(rhsInt)
        ) {
            prompt("Enter valid expression!");
            return;
        }

        const response = await fetch("http://localhost:9000/api").then((res) =>
            res.json()
        );

        for (let i = 0; i < expression.length; i++) {
            if (
                expression[i] === "A" ||
                expression[i] === "B" ||
                expression[i] === "C" ||
                expression[i] === "D" ||
                expression[i] === "E"
            ) {
                for (let j = 0; j < response.length; j++) {
                    if (response[j].label === expression[i]) {
                        expression[i] = response[j].value;
                    }
                }
            }
        }

        let temp = false;
        for (let i = 0; i < expression.length - 1; i++) {
            if (
                expression[i] !== "+" &&
                expression[i] !== "-" &&
                expression[i] !== "*" &&
                expression[i] !== "/"
            ) {
                if (
                    expression[i + 1] !== "+" &&
                    expression[i + 1] !== "-" &&
                    expression[i + 1] !== "*" &&
                    expression[i + 1] !== "/"
                ) {
                    temp = true;
                }
            }
        }

        if (temp) {
            prompt("Enter valid expression!");
            return;
        }
        const noTwoOperatorTogether = (s) => {
            let temp = false;
            for (let i = 0; i < s.length - 1; i++) {
                if (
                    s[i] === "+" ||
                    s[i] === "-" ||
                    s[i] === "/" ||
                    s[i] === "*"
                ) {
                    temp = true;
                    if (
                        s[i + 1] === "+" ||
                        s[i + 1] === "-" ||
                        s[i + 1] === "/" ||
                        s[i + 1] === "*"
                    ) {
                        return false;
                    }
                }
            }
            if (temp) {
                return true;
            } else return false;
        };

        const re =
            /(?:(?:^|[-+_*/])(?:\s*-?\d+(\.\d+)?(?:[eE][+-]?\d+)?\s*))+$/;

        function test(s) {
            return re.test(s) && noTwoOperatorTogether(s);
        }

        if (!test(expression.join(""))) {
            prompt("Enter valid expression!");
            return;
        }

        const compute = (str = "") => {
            let total = 0;
            // eslint-disable-next-line
            str = str.match(/[+\-]*(\.\d+|\d+(\.\d+)?)/g) || [];
            while (str.length) {
                total += parseFloat(str.shift());
            }
            return total;
        };

        const result = compute(expression.join(""));
        if (
            (comparator === "<" && result < rhsInt) ||
            (comparator === ">" && result > rhsInt)
        ) {
            prompt("true");
        } else {
            prompt("false");
        }
    };

    return (
        <div>
            <div className="operandContainer">
                <Operand char="A" elementState={dropElement} />
                <Operand char="B" elementState={dropElement} />
                <Operand char="C" elementState={dropElement} />
                <Operand char="D" elementState={dropElement} />
                <Operand char="E" elementState={dropElement} />
            </div>
            <div className="operatorContainer">
                <Operator operator="+" elementState={dropElement} />
                <Operator operator="-" elementState={dropElement} />
                <Operator operator="*" elementState={dropElement} />
                <Operator operator="/" elementState={dropElement} />
                <Operator operator="<" dragable={false} />
                <Operator operator=">" dragable={false} />
                <Operator operator="RHS Integer" dragable={false} />
            </div>
            <div className="draggableArea" onDragOver={dragOverHandler}></div>

            <button type="button" onClick={calculateHandler}>
                Calculate
            </button>
        </div>
    );
}

export default App;
