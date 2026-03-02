import React, { useEffect } from 'react'

/**
 * 获取数据驾驶舱数据
 * @param props 
 * @returns 
 */
type IConfigTypeProps = {
  engineering_name: string,
  engineering_value: number,
  id: string,
  config_type: 1 | 2
}
const useData = (props: any) => {
  const { dispatch } = props
  const [loading, setLoading] = React.useState(false);
  const [indicatorsData, setIndicatorsData] = React.useState<IConfigTypeProps[]>([]);
  const [engineeringData, setEngineeringData] = React.useState<IConfigTypeProps[]>([]);

  useEffect(() => {
    setLoading(true)
    if (dispatch) {
      dispatch({
        type: "engineering/getInfo",
        payload: {
          sort: 'id',
          order: 'desc'
        },
        callback: (row: any) => {
          if (Array.isArray(row.rows) && row.rows.length > 0) {
            setIndicatorsData(row.rows.filter((item: IConfigTypeProps) => String(item.config_type) === "1").slice(0, 3));
            setEngineeringData(row.rows.filter((item: IConfigTypeProps) => String(item.config_type) === "2"));
          }
          setLoading(false)
        }
      })
    }
  }, [])

  return {
    loading,
    indicatorsData,
    engineeringData
  }
}

export default useData