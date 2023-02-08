enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

type Listener = (items: Project[]) => void;

class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}
const projectState = ProjectState.getInstance(); // we guarantee to always working with the exact same object

interface Validation {
  inputName: string;
  value: string | number;
  required?: boolean; // "?" optional OR boolean | undefined
  minLen?: number; // check the length of the string
  maxLen?: number;
  min?: number; // check the value of the number
  max?: number;
}

function validate(inputValidation: Validation): [boolean, string[]] {
  let isValid = true;
  let errors: string[] = []; // alert type

  if (inputValidation.required) {
    isValid = isValid && inputValidation.value.toString().trim().length !== 0;
    if (!(inputValidation.value.toString().trim().length !== 0)) {
      errors.push(`the property ${inputValidation.inputName} must be present`);
    }
  }
  if (
    inputValidation.minLen != null &&
    typeof inputValidation.value === "string"
  ) {
    isValid = isValid && inputValidation.value.length >= inputValidation.minLen;
    if (!(inputValidation.value.length >= inputValidation.minLen)) {
      errors.push(
        `the property ${inputValidation.inputName} must have a length greater than ${inputValidation.minLen}`
      );
    }
  }
  if (
    inputValidation.maxLen != null &&
    typeof inputValidation.value === "string"
  ) {
    isValid = isValid && inputValidation.value.length <= inputValidation.maxLen;
    if (!(inputValidation.value.length <= inputValidation.maxLen)) {
      errors.push(
        `the property ${inputValidation.inputName} must have a length lower or equal to ${inputValidation.maxLen}`
      );
    }
  }
  if (
    inputValidation.min != null &&
    typeof inputValidation.value === "number"
  ) {
    isValid = isValid && inputValidation.value >= inputValidation.min;
    if (!(inputValidation.value >= inputValidation.min)) {
      errors.push(
        `the property ${inputValidation.inputName} must have a value greater than ${inputValidation.min}`
      );
    }
  }
  if (
    inputValidation.max != null &&
    typeof inputValidation.value === "number"
  ) {
    isValid = isValid && inputValidation.value <= inputValidation.max;
    if (!(inputValidation.value <= inputValidation.max)) {
      errors.push(
        `the property ${inputValidation.inputName} must have a value lower or equal to ${inputValidation.max}`
      );
    }
  }
  return [isValid, errors];
}

function showCustomAlert(errorMessages: string[]): void {
  let customMessage: string = "";

  if (errorMessages.length > 0) {
    customMessage = `${errorMessages}.`;
    alert(customMessage);
  }
}

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

class ProjectList {
  tempEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    this.tempEl = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects = [];

    const importedNode = document.importNode(this.tempEl.content, true);
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    for (const projectItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = projectItem.title;
      listEl.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private attach() {
    this.hostEl.insertAdjacentElement("beforeend", this.element);
  }
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
    this.element = importedNode.firstElementChild as HTMLFormElement; // put the content of the importNode inside the element which is form
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

  private collectingUserInputs(): [string, string, number] | void {
    const enteredTitle = this.titleInput.value;
    const enteredDesc = this.descInput.value;
    const enteredPeople = this.peopleInput.value;

    const titleValidation: Validation = {
      inputName: "title",
      value: enteredTitle,
      required: true,
    };

    const descValidation: Validation = {
      inputName: "description",
      value: enteredDesc,
      required: true,
      minLen: 5,
      maxLen: 20,
    };

    const peopleValidation: Validation = {
      inputName: "people",
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 10,
    };

    const [titleIsValid, titleErrors]: [boolean, string[]] =
      validate(titleValidation);
    const [descriptionIsValid, descriptionErrors]: [boolean, string[]] =
      validate(descValidation);
    const [peopleAmountIsValid, peopleAmountErrors]: [boolean, string[]] =
      validate(peopleValidation);

    if (!titleIsValid || !descriptionIsValid || !peopleAmountIsValid) {
      showCustomAlert(
        titleErrors.concat(descriptionErrors).concat(peopleAmountErrors)
      );
      return;
    } else {
      return [enteredTitle, enteredDesc, +enteredPeople];
    }
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const inputs = this.collectingUserInputs();
    if (Array.isArray(inputs)) {
      const [title, description, people] = inputs;
      console.log(title, description, people);
      projectState.addProject(title, description, people);
      this.titleInput.value = "";
      this.descInput.value = "";
      this.peopleInput.value = "";
    }
  }

  private config() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.element); // insert the form element inside the host.
  }
}

const projectInput = new ProjectInput();
const activeProject = new ProjectList("active");
const finishedProject = new ProjectList("finished");
