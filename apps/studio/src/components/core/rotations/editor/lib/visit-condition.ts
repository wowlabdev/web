import type { Condition } from "wowlab-engine";

export type ConditionVisitor = {
  onRead?: (node: Extract<Condition, { type: "read" }>) => boolean | void;
  onVar?: (node: Extract<Condition, { type: "var" }>) => boolean | void;
  onBool?: (node: Extract<Condition, { type: "bool" }>) => boolean | void;
  onInt?: (node: Extract<Condition, { type: "int" }>) => boolean | void;
  onFloat?: (node: Extract<Condition, { type: "float" }>) => boolean | void;
};

export function visitCondition(
  node: Condition,
  visitor: ConditionVisitor,
): boolean {
  switch (node.type) {
    case "and":
    case "or": {
      for (const operand of node.operands) {
        if (visitCondition(operand, visitor)) {
          return true;
        }
      }

      return false;
    }

    case "arith":
    case "compare":
    case "min_max": {
      return (
        visitCondition(node.left, visitor) ||
        visitCondition(node.right, visitor)
      );
    }

    case "bool": {
      return visitor.onBool?.(node) === true;
    }

    case "float": {
      return visitor.onFloat?.(node) === true;
    }

    case "if_then_else": {
      return (
        visitCondition(node.condition, visitor) ||
        visitCondition(node.then, visitor) ||
        visitCondition(node.otherwise, visitor)
      );
    }

    case "int": {
      return visitor.onInt?.(node) === true;
    }

    case "not":
    case "unary_math": {
      return visitCondition(node.operand, visitor);
    }

    case "read": {
      return visitor.onRead?.(node) === true;
    }

    case "var": {
      return visitor.onVar?.(node) === true;
    }
  }
}
