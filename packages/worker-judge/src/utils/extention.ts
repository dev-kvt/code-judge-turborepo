import { Language } from "@kpmg/database";

export const getExtentionByLanguage = (language: Language) => {
  switch (language) {
    case Language.CPP:
      return "cpp";
    case Language.JAVA:
      return "java";
    case Language.PYTHON:
      return "py";
    default:
      return "";
  }
};
