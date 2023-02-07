function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

class ProjectInput {
  tempEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;
  titleInput: HTMLInputElement;
  descInput: HTMLInputElement;
  peopleInput: HTMLInputElement;

  constructor() {
    this.tempEl = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.tempEl.content, true); // take the content of the template.
    this.element = importedNode.firstElementChild as HTMLFormElement; // put the content of the importNode inside the host which is div 'app'.
    this.element.id = "user-input";

    this.titleInput = this.element.querySelector("#title") as HTMLInputElement;
    this.descInput = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInput = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.config();
    this.attach();
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInput.value);
  }

  private config() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.element); // insert the form element inside the host.
  }
}

const prjInput = new ProjectInput();
