import { Rate } from 'antd';
import React, { useEffect } from 'react';

const LecturerRate = (props: any) => {

  const { selectedMaterialItem } = props;

  const desc = ['1分', '2分', '3分', '4分', '5分'];

  const [lecturerList, setLecturerList] = React.useState<any[]>([]);
  const [value1, setValue1] = React.useState(0);
  const [value2, setValue2] = React.useState(0);
  const [value3, setValue3] = React.useState(0);

  useEffect(() => {
    try {
      const arr: any[] = [];
      const names = selectedMaterialItem.lecturer_names.split(',');
      const ids = selectedMaterialItem.lecturer_ids.split(',');
      names.forEach((name: any, index: number) => {
        arr.push({
          lecturer_name: name,
          lecturer_id: ids[index],
        })
      })
      setLecturerList(arr)
    } catch (e) {

    }

  }, []);


  return (
    <div>
      <strong style={{fontSize: 18}}>讲师评价</strong>
      <dl style={{ marginTop: '16px' }}>
        {lecturerList.map((item: any, index: number) => {
          return (
            <dd key={item.lecturer_id}>
              <strong>讲师：{item.lecturer_name}</strong>
              <div>
                讲课水平
                <div>
                  <Rate tooltips={desc} onChange={setValue1} value={value1} />
                </div>
              </div>
              <div>
                讲课质量
                <div>
                  <Rate tooltips={desc} onChange={setValue2} value={value2} />
                </div>
              </div>
              <div>
                专业知识
                <div>
                  <Rate tooltips={desc} onChange={setValue3} value={value3} />
                </div>
              </div>
            </dd>
          )
        })}
      </dl>
      {/*{selectedMaterialItem.lecturer_names}*/}
      {/*{selectedMaterialItem.lecturer_ids}*/}
    </div>
  )
}

export default LecturerRate;
