console.log("Hey there!")

class ProjectInput {
  tempEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;

  constructor() {
    this.tempEl = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.tempEl.content, true); // take the content of the template.
    this.element = importedNode.firstElementChild as HTMLFormElement; // put the content of the importNode inside the host which is div 'app'.

    this.attach();
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.element); // insert the form element inside the host.
  }
}

const prjInput = new ProjectInput();