import { replaceUnderscores } from "./utils";

export function validateFields(inputData, rules) {
    const errors = {};
  
    for (const fieldName in rules) {
      const fieldRules = rules[fieldName];
      const fieldValue = inputData[fieldName];
  
      if (fieldRules.required && !fieldValue) {
        errors[fieldName] = `${replaceUnderscores(fieldName)} is required.`;
        continue;
      }

      if (fieldRules.type === 'number' && isNaN(fieldValue)) {
        errors[fieldName] = `${replaceUnderscores(fieldName)} should be a number.`;
        continue;
      } else if (fieldRules.type === 'string' && fieldRules.type && typeof fieldValue !== fieldRules.type) {
        errors[fieldName] = `${replaceUnderscores(fieldName)} should be of type ${fieldRules.type}.`;
        continue;
      }
       
      if (
        fieldRules.minLength &&
        fieldValue.length < fieldRules.minLength
      ) {
        errors[fieldName] = `${replaceUnderscores(fieldName)} there should be at least ${fieldRules.minLength} symbols.`;
        continue;
      }
      
      if (
        fieldRules.maxLength &&
        fieldValue.length > fieldRules.maxLength
      ) {
        errors[fieldName] = `${replaceUnderscores(fieldName)} there should be the most ${fieldRules.maxLength} symbols.`;
        continue;
      }
    }
  
    return errors;
  }