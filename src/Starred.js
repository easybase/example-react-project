import { useState, useEffect } from 'react'
import { useEasybase } from 'easybase-react'

export default function Starred() {
    const [data, setData] = useState([]);

    const { db } = useEasybase();

    useEffect(() => {
        db('USER STARS', true).return().limit(10).all()
            .then(res => Array.isArray(res) && setData(res));
    }, [])

    return (
        <div>
            {data.map(ele =>
                <div className="cardRoot" style={{ height: 50, alignItems: "center", justifyContent: "center" }}>
                    <a href={ele.amazon_link}>{ele.product_name}</a>
                </div>
            )}
        </div>
    )
}