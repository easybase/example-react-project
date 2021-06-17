import { useState, useEffect } from 'react'
import { useEasybase } from 'easybase-react'

export default function FilterExample() {
  const {
    Query
  } = useEasybase()

  const [arr, setArr] = useState([]);

  useEffect(() => {
    Query({ queryName: "price filter", tableName: "REACT DEMO" }).then(res => {
      setArr(res);
    });
  }, [])

  return (
    <div style={{ display: "flex" }}>
      {arr.map(ele =>
        <div className="cardRoot">
          <a href={ele.amazon_link}><img src={ele.demo_image}  /></a>
          <h4>{ele.product_name}</h4>
          <p>${ele.price}</p>
        </div>
      )}
    </div>
  )
}