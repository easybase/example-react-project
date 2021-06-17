import React, { useState, useEffect } from 'react';
import { useEasybase } from 'easybase-react';

export default function Home() {
    const [minPrice, setMinPrice] = useState(0);
    const { db, useReturn, e, isUserSignedIn } = useEasybase();

    const { frame } = useReturn(() => db("REACT DEMO")
        .return()
        .where(e.gt('price', minPrice)) // e.gt = "Greater Than"
        .limit(10),
        [minPrice]);

    const handleStarClick = (ele) => {
        if (isUserSignedIn()) {
            db("USER STARS").insert({ product_name: ele.product_name, amazon_link: ele.amazon_link }).one();
        } else {
            alert("Please sign in to save entries for later")
        }
    }

    return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            <label class="minPrice">
                Minimum Price:
                <input type="number" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} />
            </label>
            {frame.map(ele =>
                <div className="cardRoot">
                    <a href={ele.amazon_link}><img src={ele.demo_image} /></a>
                    <h4>{ele.product_name}</h4>
                    <p>${ele.price}</p>
                    <button className="cardButton" onClick={() => handleStarClick(ele)}>⭐ Save for later ⭐</button>
                </div>
            )}
            <AddCardButton />
        </div>
    )
}


function AddCardButton() {
    const { db } = useEasybase();

    const handleAddCardClick = async () => {
        try {
            const inLink = prompt("Please enter an Amazon link", "https://...");
            const inImage = prompt("Please enter an image link", "https://...");
            const inName = prompt("Please enter a product name", "");
            const inPrice = prompt("Please enter a price as a number", "14.24");
            if (!inPrice || !inName || !inImage || !inLink) return;

            await db('REACT DEMO').insert({
                amazon_link: inLink,
                product_name: inName,
                price: Number(inPrice),
                demo_image: inImage
            }).one();
        } catch (_) {
            alert("Error on input format")
        }
    }

    return <button onClick={handleAddCardClick} className="insertCardButton">+ Add Card</button>
}


