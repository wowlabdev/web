import type { useIntlayer } from "next-intlayer";
import type { ValidationError } from "wowlab-engine";

export function renderError(
  content: ReturnType<typeof useIntlayer>,
  err: ValidationError,
): string {
  switch (err.type) {
    case "actionExpansionLimitExceeded": {
      return content.validationErrorActionExpansion({
        actions: err.actions,
        max: err.max,
      }).value;
    }

    case "circularReference": {
      return content.validationErrorCircular({
        path: err.path.join(" -> "),
      }).value;
    }

    case "duplicateList": {
      return content.validationErrorDuplicateList({ name: err.name }).value;
    }

    case "duplicateVariable": {
      return content.validationErrorDuplicateVariable({ name: err.name }).value;
    }

    case "emptyActionList": {
      return content.validationErrorEmptyList({ name: err.list_name }).value;
    }

    case "invalidExpression": {
      return err.message;
    }

    case "maxDepthExceeded": {
      return content.validationErrorMaxDepth({
        depth: err.depth,
        max: err.max,
      }).value;
    }

    case "typeMismatch": {
      return content.validationErrorTypeMismatch({
        expected: err.expected,
        got: err.got,
        name: err.name,
        op: err.op,
      }).value;
    }

    case "undefinedList": {
      return content.validationErrorUndefinedList({ name: err.name }).value;
    }

    case "undefinedVariable": {
      return content.validationErrorUndefinedVariable({ name: err.name }).value;
    }

    case "unknownField": {
      return content.validationErrorUnknownField({
        domain: err.domain,
        name: err.name,
      }).value;
    }

    case "unsupportedSyntax": {
      return content.validationErrorUnsupportedSyntax({
        construct: err.construct,
      }).value;
    }
  }
}

export function renderErrorBadge(
  content: ReturnType<typeof useIntlayer>,
  type: ValidationError["type"],
): string {
  switch (type) {
    case "actionExpansionLimitExceeded": {
      return content.validationErrorTypeActionExpansion.value;
    }

    case "circularReference": {
      return content.validationErrorTypeCircular.value;
    }

    case "duplicateList": {
      return content.validationErrorTypeDuplicateList.value;
    }

    case "duplicateVariable": {
      return content.validationErrorTypeDuplicateVariable.value;
    }

    case "emptyActionList": {
      return content.validationErrorTypeEmptyList.value;
    }

    case "invalidExpression": {
      return content.validationErrorTypeInvalid.value;
    }

    case "maxDepthExceeded": {
      return content.validationErrorTypeMaxDepth.value;
    }

    case "typeMismatch": {
      return content.validationErrorTypeMismatchBadge.value;
    }

    case "undefinedList": {
      return content.validationErrorTypeUndefinedList.value;
    }

    case "undefinedVariable": {
      return content.validationErrorTypeUndefinedVariable.value;
    }

    case "unknownField": {
      return content.validationErrorTypeUnknownField.value;
    }

    case "unsupportedSyntax": {
      return content.validationErrorTypeUnsupportedSyntax.value;
    }
  }
}
