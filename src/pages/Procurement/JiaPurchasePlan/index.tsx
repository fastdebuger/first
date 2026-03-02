import React from "react";
import ListAndTilePage from "@/components/ListAndTilePage";
import ListPage from "./List";
import TilePage from "./tile";

const JiaPurchasePlanInfo: React.FC<any> = (props: any) => {
  const {route: {authority, name}} = props;
  
  return (
    <ListAndTilePage title='需求计划'>
      <ListPage authority={authority} moduleCaption={name} needShow/>
      <TilePage authority={authority} moduleCaption={`${name}平铺`} needShow/>
    </ListAndTilePage>
  )
}

export default JiaPurchasePlanInfo;
