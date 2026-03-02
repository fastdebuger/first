import React from 'react';
import {Drawer, Input} from "antd";
import DrawerDetail from "./DrawerDetail";

const SelectedQuestionList = (props: any) => {

  const { onChange } = props;

  const [visible, setVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  return (
    <>
      <Input.Search readOnly value={selectedItem ? selectedItem.question_content : undefined} placeholder="选择题目" onSearch={() => {
        setVisible(true);
      }} />
      {visible && (
        <Drawer
          width={'80%'}
          title="选择题目"
          placement="right"
          onClose={() => setVisible(false)}
          open={visible}
        >
          <DrawerDetail onChange={(_item: any) => {
            setSelectedItem(_item);
            setVisible(false)
            console.log("_item---", _item);
            onChange(_item.id)
          }}/>
        </Drawer>
      )}
    </>
  )
}

export default SelectedQuestionList;
