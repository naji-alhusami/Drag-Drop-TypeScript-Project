// We add this interface to ProjectItem class
interface Drag {
  startHandler(event: DragEvent): void;
  endHandler(event: DragEvent): void;
}

// We add this interface to ProjectList class
interface DragGoal {
  overHandler(event: DragEvent): void; // signal the browser that the thing the we are dragging to some target is a valid target (permit the drop)
  dropHandler(event: DragEvent): void; // handle the drop (we can update the data)
  leaveHandler(event: DragEvent): void; // give visual feedback about the result of the dragging
}

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

type Listener<T> = (items: T[]) => void;

class GeneralState<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends GeneralState<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
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

//General Class:
abstract class GeneralClass<T extends HTMLElement, U extends HTMLElement> {
  // we added abstract because it should always use for inheritance
  tempEl: HTMLTemplateElement;
  hostEl: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    elementLocation: boolean,
    newElementId?: string
  ) {
    this.tempEl = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostEl = document.getElementById(hostElementId)! as T;
    const importedNode = document.importNode(this.tempEl.content, true); // take the content of the template.
    this.element = importedNode.firstElementChild as U; // put the content of the importNode inside the element which is form
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(elementLocation);
  }

  private attach(elementLocation: boolean) {
    this.hostEl.insertAdjacentElement(
      elementLocation ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void; // we added it without any coding to make sure that it should be used in inheritance classes
  abstract renderContent(): void; // we added it without any coding to make sure that it should be used in inheritance classes
}

class ProjectItem
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
    console.log(event);
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

class ProjectList extends GeneralClass<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.tempEl = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  configure() {
    projectState.addListener((projects: Project[]) => {
      const filteredProjects = projects.filter((project) => {
        if (this.type === "active") {
          return project.status === ProjectStatus.Active;
        }
        return project.status === ProjectStatus.Finished;
      });
      this.assignedProjects = filteredProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
    }
  }
}

class ProjectInput extends GeneralClass<HTMLDivElement, HTMLFormElement> {
  titleInput: HTMLInputElement;
  descInput: HTMLInputElement;
  peopleInput: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInput = this.element.querySelector("#title") as HTMLInputElement;
    this.descInput = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInput = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

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
}

const projectInput = new ProjectInput();
const activeProject = new ProjectList("active");
const finishedProject = new ProjectList("finished");
