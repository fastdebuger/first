import { Button, Card, Drawer, Tag } from 'antd';
import React from 'react';
import DrawerDetail from "@/components/CommonList/SelectedCourseList/DrawerDetail";

const PushCourseList: React.FC = (props: any) => {

  const { onChange } = props;

  const [visible, setVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<string>(null);

  return (
    <div>
      {selectedItem ? (
        <Card
          onClick={() => setVisible(true)}
          style={{width: 300, cursor: 'pointer'}}
          className="border-2 border-gray-100 shadow-none transition-all hover:border-blue-200 hover:shadow-md"
          bodyStyle={{
            padding: 12
          }}
        >
          <div className="mb-3">
            <h3 className="mb-1 text-base font-semibold text-gray-800">
              人员进场培训课程
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Tag color={'blue'}>人力资源、党委组织</Tag>
            </div>
          </div>
          <div style={{marginTop: 16}} className="mb-4 line-clamp-2 text-sm text-gray-500">
            人员进场培训课程人员进场培训课程人员进场培训课程
          </div>
        </Card>
        ) : (
        <Button type="primary" onClick={() => setVisible(true)}>
          新增课程
        </Button>
      )}
      {visible && (
        <Drawer
          width={'80%'}
          title="选择课程"
          placement="right"
          onClose={() => setVisible(false)}
          open={visible}
        >
          <DrawerDetail onChange={(_item: any) => {
            setSelectedItem(_item);
            setVisible(false)
            onChange(_item.id, _item)
          }}/>
        </Drawer>
      )}
    </div>
  )
}

export default PushCourseList;
