import React from "react";
import ListAndTilePage from "@/components/ListAndTilePage";
import ListPage from "./List";
import TilePage from "./tile";

const JiaSplitBudgetInfo: React.FC<any> = (props: any) => {
  const {route: {authority, name}} = props
  return (
    <ListAndTilePage title='分割预算'>
      <ListPage authority={authority} moduleCaption={name} needShow/>
      <TilePage authority={authority} moduleCaption={`${name}平铺`} needShow/>
    </ListAndTilePage>
  )
}

export default JiaSplitBudgetInfo;
