export interface Drag {
  startHandler(event: DragEvent): void;
  endHandler(event: DragEvent): void;
}

// We add this interface to ProjectList class
export interface DragGoal {
  overHandler(event: DragEvent): void; // signal the browser that the thing the we are dragging to some target is a valid target (permit the drop)
  dropHandler(event: DragEvent): void; // handle the drop (we can update the data)
  leaveHandler(event: DragEvent): void; // give visual feedback about the result of the dragging
}
