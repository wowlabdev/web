"use client";

import { useBoolean } from "ahooks";
import { ChevronDownIcon, WrapTextIcon } from "lucide-react";

import { Button } from "@wowlab/shared/components/ui/button";
import { cn } from "@wowlab/shared/lib/utils";

import { ConditionAiButton } from "../assistant/condition-ai-button";
import {
  type Condition,
  type ConditionEditorCtx,
  conditionLabel,
  convertConditionType,
} from "../types";
import { ConditionTypeSelect } from "./condition-type-select";
import { FieldReadEditor } from "./field-read-editor";
import { ArithNode } from "./nodes/arith-node";
import { BoolNode } from "./nodes/bool-node";
import { CompareNode } from "./nodes/compare-node";
import { FloatNode } from "./nodes/float-node";
import { IfThenElseNode } from "./nodes/if-then-else-node";
import { IntNode } from "./nodes/int-node";
import { MinMaxNode } from "./nodes/min-max-node";
import { UnaryMathNode } from "./nodes/unary-math-node";
import { VarNode } from "./nodes/var-node";
import { OperandList } from "./operand-list";

type ConditionBuilderProps = {
  value: Condition;
  onChange: (node: Condition) => void;
  ctx: ConditionEditorCtx;
};

export function ConditionBuilder({
  ctx,
  onChange,
  value,
}: Readonly<ConditionBuilderProps>) {
  const [isCollapsed, { toggle: toggleCollapsed }] = useBoolean(ctx.depth > 2);
  const childCtx = { ...ctx, depth: ctx.depth + 1 };

  if (isCollapsed) {
    return (
      <button
        type="button"
        className="flex w-full items-center gap-1.5 rounded-none border border-dashed border-border/60 px-2 py-1 text-left text-xs text-muted-foreground hover:border-border hover:text-foreground"
        onClick={toggleCollapsed}
      >
        <ChevronDownIcon className="size-3 -rotate-90" />
        <span className="truncate">{conditionLabel(value)}</span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "space-y-2 border-l-2 pl-3",
        ctx.depth === 0 && "border-primary/40",
        ctx.depth === 1 && "border-emerald-500/40",
        ctx.depth >= 2 && "border-amber-500/40",
      )}
    >
      <div className="flex items-center gap-1.5">
        <ConditionTypeSelect
          value={value.type}
          onChange={(t) => onChange(convertConditionType(t, value))}
        />
        {ctx.depth === 0 && (
          <ConditionAiButton ctx={ctx} onGenerated={onChange} />
        )}
        {ctx.depth > 0 && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-6"
            onClick={toggleCollapsed}
          >
            <WrapTextIcon className="size-3" />
          </Button>
        )}
      </div>

      <ConditionBody value={value} onChange={onChange} ctx={childCtx} />
    </div>
  );
}

function ConditionBody({
  ctx,
  onChange,
  value,
}: Readonly<ConditionBuilderProps>) {
  switch (value.type) {
    case "and":
    case "or": {
      return (
        <OperandList
          operands={value.operands}
          onChange={(operands) => onChange({ ...value, operands })}
          ctx={ctx}
          Builder={ConditionBuilder}
        />
      );
    }

    case "arith": {
      return (
        <ArithNode
          node={value}
          onChange={onChange}
          ctx={ctx}
          Builder={ConditionBuilder}
        />
      );
    }

    case "bool": {
      return <BoolNode node={value} onChange={onChange} />;
    }

    case "compare": {
      return (
        <CompareNode
          node={value}
          onChange={onChange}
          ctx={ctx}
          Builder={ConditionBuilder}
        />
      );
    }

    case "float": {
      return <FloatNode node={value} onChange={onChange} />;
    }

    case "if_then_else": {
      return (
        <IfThenElseNode
          node={value}
          onChange={onChange}
          ctx={ctx}
          Builder={ConditionBuilder}
        />
      );
    }

    case "int": {
      return <IntNode node={value} onChange={onChange} />;
    }

    case "min_max": {
      return (
        <MinMaxNode
          node={value}
          onChange={onChange}
          ctx={ctx}
          Builder={ConditionBuilder}
        />
      );
    }

    case "not": {
      return (
        <ConditionBuilder
          value={value.operand}
          onChange={(operand) => onChange({ ...value, operand })}
          ctx={ctx}
        />
      );
    }

    case "read": {
      return <FieldReadEditor node={value} onChange={onChange} ctx={ctx} />;
    }

    case "unary_math": {
      return (
        <UnaryMathNode
          node={value}
          onChange={onChange}
          ctx={ctx}
          Builder={ConditionBuilder}
        />
      );
    }

    case "var": {
      return <VarNode node={value} onChange={onChange} />;
    }
  }
}
