
 export interface Validation {
    inputName: string;
    value: string | number;
    required?: boolean; // "?" optional OR boolean | undefined
    minLen?: number; // check the length of the string
    maxLen?: number;
    min?: number; // check the value of the number
    max?: number;
  }
  
 export function validate(inputValidation: Validation): [boolean, string[]] {
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
  
  export function showCustomAlert(errorMessages: string[]): void {
    let customMessage: string = "";
  
    if (errorMessages.length > 0) {
      customMessage = `${errorMessages}.`;
      alert(customMessage);
    }
  }