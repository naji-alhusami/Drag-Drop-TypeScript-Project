import { GeneralClass } from "./general-class.js";
import { Drag } from "../models/drag-drop.js";
import { AutoBind } from "../decorators/autobind.js";

export class ProjectItem
  extends GeneralClass<HTMLUListElement, HTMLLIElement>
  implements Drag
{
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 Person";
    } else {
      return `${this.project.people} Persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @AutoBind
  startHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }
  endHandler(_: DragEvent) {
    console.log("drag end");
  }

  configure() {
    this.element.addEventListener("dragstart", this.startHandler);
    this.element.addEventListener("dragend", this.endHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " Assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}