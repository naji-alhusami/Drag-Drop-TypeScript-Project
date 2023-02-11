import { GeneralClass } from "./general-class";
import { Validation, validate, showCustomAlert } from "../util/validation";
import { AutoBind } from "../decorators/autobind";
import { projectState } from "../state/project-state";

export class ProjectInput extends GeneralClass<HTMLDivElement, HTMLFormElement> {
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