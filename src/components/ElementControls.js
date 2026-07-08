import React from "react";

export function ElementControls({ itemId, itemType, onResize, onRotate, onConfirm }) {
	return (
		<>
			<div
				className="resize-handle top-left"
				onMouseDown={(e) => onResize(itemId, itemType, "top-left", e)}
			></div>
			<div
				className="resize-handle top-right"
				onMouseDown={(e) => onResize(itemId, itemType, "top-right", e)}
			></div>
			<div
				className="resize-handle bottom-left"
				onMouseDown={(e) => onResize(itemId, itemType, "bottom-left", e)}
			></div>
			<div
				className="resize-handle bottom-right"
				onMouseDown={(e) => onResize(itemId, itemType, "bottom-right", e)}
			></div>
			<div className="rotate-handle" onMouseDown={(e) => onRotate(itemId, itemType, e)}>
				⟲
			</div>
			<div className="confirm-handle" onClick={onConfirm}>
				✓
			</div>
		</>
	);
}
