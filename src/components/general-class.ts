//General Class:
export abstract class GeneralClass<T extends HTMLElement, U extends HTMLElement> {
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