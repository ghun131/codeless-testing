import { memo, useRef } from "react";
import { Panel } from "reactflow";
import { v4 as uuid } from "uuid";
import { RFNode } from "./nodeFactory";
import { useOnClickOutside } from "./useClickOutside";

function NodeMenuPanel({ ref, setNodes, setShowMenu }) {
  const nodeMenuRef = useRef(null);

  function handleClick(event) {
    const newNode = new RFNode({
      id: uuid(),
      data: {},
      position: { x: 20, y: 250 },
      type: event.target.getAttribute("id"),
      style: { border: "1px solid #777", padding: 10 },
    });
    setNodes((prev) => [...prev, newNode]);
    setShowMenu(false);
  }
  return (
    <section ref={nodeMenuRef}>
      <Panel position="top-left" style={{ left: 120 }} >
        <div>
          <button id="visitNode" onClick={handleClick}>
            Visit node
          </button>
        </div>
        <br />
        <div>
          <button id="textInputType" onClick={handleClick}>
            Typing node
          </button>
        </div>
        <br />
        <div>
          <button id="checkboxNode" onClick={handleClick}>
            Checkbox node
          </button>
        </div>
        <br />
        <div>
          <button id="buttonNode" onClick={handleClick}>
            Button node
          </button>
        </div>
      </Panel>
    </section>
  );
}

export default memo(NodeMenuPanel);
