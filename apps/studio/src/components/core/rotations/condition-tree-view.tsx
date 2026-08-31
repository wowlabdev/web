"use client";

import type { ReactElement } from "react";

import { useIntlayer } from "next-intlayer";

import { Badge } from "@wowlab/shared/components/ui/badge";

import type { Condition, SpecSpellMap } from "./rotation-view-types";

import { ConditionReadView } from "./condition-read-view";

type ConditionTreeViewProps = {
  condition: Condition;
  specMap: SpecSpellMap | null;
};

const COMPARE_LABEL: Record<string, string> = {
  eq: "==",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  ne: "!=",
};

const ARITH_LABEL: Record<string, string> = {
  add: "+",
  div: "/",
  mod: "%",
  mul: "*",
  sub: "-",
};

export function ConditionTreeView({
  condition,
  specMap,
}: Readonly<ConditionTreeViewProps>): ReactElement {
  const content = useIntlayer("rotations");

  const minMaxLabel: Record<string, string> = {
    max: content.operatorMax.value,
    min: content.operatorMin.value,
  };

  const unaryMathLabel: Record<string, string> = {
    abs: content.operatorAbs.value,
    ceil: content.operatorCeil.value,
    floor: content.operatorFloor.value,
  };

  const renderChild = (child: Condition): ReactElement => (
    <ConditionTreeView condition={child} specMap={specMap} />
  );

  switch (condition.type) {
    case "and": {
      if (condition.operands.some((operand) => isFalseBool(operand))) {
        return <span>{String(false)}</span>;
      }

      const operands = condition.operands.filter((n) => !isTrueBool(n));

      if (operands.length === 0) {
        return <span>{String(true)}</span>;
      }

      return (
        <>
          {withConditionKeys(operands).map(({ condition: operand, key }, i) => (
            <span key={key} className="inline-flex items-center gap-x-1">
              {i > 0 && <span>{content.conditionLogicalAnd}</span>}
              <ConditionTreeView condition={operand} specMap={specMap} />
            </span>
          ))}
        </>
      );
    }

    case "arith": {
      return (
        <>
          {renderChild(condition.left)}
          <span>{ARITH_LABEL[condition.op] ?? condition.op}</span>
          {renderChild(condition.right)}
        </>
      );
    }

    case "bool": {
      return <span>{String(condition.value)}</span>;
    }

    case "compare": {
      return (
        <>
          {renderChild(condition.left)}
          <span>{COMPARE_LABEL[condition.op] ?? condition.op}</span>
          {renderChild(condition.right)}
        </>
      );
    }

    case "float":
    case "int": {
      return <span>{String(condition.value)}</span>;
    }

    case "if_then_else": {
      return (
        <span className="inline-flex items-center gap-x-1">
          <span>{content.operatorIf}</span>
          {renderChild(condition.condition)}
          <span>{content.operatorThen}</span>
          {renderChild(condition.then)}
          <span>{content.operatorElse}</span>
          {renderChild(condition.otherwise)}
        </span>
      );
    }

    case "min_max": {
      return (
        <span className="inline-flex items-center gap-x-1">
          <span>{minMaxLabel[condition.op] ?? condition.op}(</span>
          {renderChild(condition.left)}
          <span>,</span>
          {renderChild(condition.right)}
          <span>)</span>
        </span>
      );
    }

    case "not": {
      return (
        <span className="inline-flex items-center gap-x-1">
          <span>{content.operatorNot}</span>
          {renderChild(condition.operand)}
        </span>
      );
    }

    case "or": {
      if (condition.operands.some((operand) => isTrueBool(operand))) {
        return <span>{String(true)}</span>;
      }

      const operands = condition.operands.filter((n) => !isFalseBool(n));

      if (operands.length === 0) {
        return <span>{String(false)}</span>;
      }

      return (
        <>
          {withConditionKeys(operands).map(({ condition: operand, key }, i) => (
            <span key={key} className="inline-flex items-center gap-x-1">
              {i > 0 && <span>{content.conditionLogicalOr}</span>}
              <ConditionTreeView condition={operand} specMap={specMap} />
            </span>
          ))}
        </>
      );
    }

    case "read": {
      return (
        <ConditionReadView
          condition={condition}
          content={content}
          specMap={specMap}
        />
      );
    }

    case "unary_math": {
      return (
        <span className="inline-flex items-center gap-x-1">
          <span>{unaryMathLabel[condition.op] ?? condition.op}(</span>
          {renderChild(condition.operand)}
          <span>)</span>
        </span>
      );
    }

    case "var": {
      return (
        <Badge variant="outline" className="text-xs font-mono">
          var:
          {condition.name}
        </Badge>
      );
    }
  }
}

function isFalseBool(node: Condition): boolean {
  return node.type === "bool" && node.value === false;
}

function isTrueBool(node: Condition): boolean {
  return node.type === "bool" && node.value === true;
}

function withConditionKeys(conditions: Condition[]) {
  const occurrences = new Map<string, number>();

  return conditions.map((condition) => {
    const serialized = JSON.stringify(condition);
    const occurrence = occurrences.get(serialized) ?? 0;

    occurrences.set(serialized, occurrence + 1);

    return { condition, key: `${serialized}:${occurrence}` };
  });
}
