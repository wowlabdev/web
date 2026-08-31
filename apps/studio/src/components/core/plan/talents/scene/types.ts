export type TalentSceneOptions = {
  selection?: TalentSelection;
  shouldShowLabels?: boolean;
};

export type TalentSelection = {
  selectedNodeIds: ReadonlySet<number>;
  ranksByNodeId?: ReadonlyMap<number, number>;
};
