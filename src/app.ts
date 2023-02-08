interface Validation {
  // input: HTMLInputElement;
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

    // if(!titleIsValid) {
    //     showCustomAlert (titleErrors);
    // }

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

const prjInput = new ProjectInput();
