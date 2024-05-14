import { useState, useEffect } from "react";
import { Nutrition } from "./Nutrition";
import video from './salad.mp4';
import { LoaderPage } from "./Loader/LoaderPage";
import Swal from "sweetalert2";
import './App.css';

function App() {
  const [mySearch, setMySearch] = useState();
  const [wordSubmitted, setWordSubmitted] = useState('');
  const [myNutrition, setMyNutrition] = useState();
  const [stateLoader, setStateLoader] = useState(false);

  const APP_ID = '131b1b9b';
  const APP_KEY = '9d1ee6e59c28dafce6ea4c075887844e';
  const APP_URL = 'https://api.edamam.com/api/nutrition-details'

  const fetchData = async (ingr) => {
    setStateLoader(true);

    const response = await fetch(`${APP_URL}?app_id=${APP_ID}&app_key=${APP_KEY}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingr: ingr })
    })

    if(response.ok) {
      setStateLoader(false);
      const data = await response.json();
      setMyNutrition(data);
    } else {
      setStateLoader(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "ingredients entered incorrectly",
      });
    }
  }

  const myNutritionSearch = e => {
    setMySearch(e.target.value);
  }

  const finalSearch = e => {
    e.preventDefault();
    setWordSubmitted(mySearch);
  }

  useEffect(() => {
    if (wordSubmitted !== '') {
      let ingr = wordSubmitted.split(/[,,;,\n,\r]/);
      fetchData(ingr);
    }
  }, [wordSubmitted])


  return (
    <div className="App">
    {stateLoader && <LoaderPage />}
      
<div className="container">
<video autoPlay muted loop>
   <source src={video} type="video/mp4" />
</video>
<h1>Nutrition Analysis</h1>
</div>
<div className="container">
<form onSubmit={finalSearch}>
  <input className="search"
    placeholder="Search..."
    onChange={myNutritionSearch}/>
    <div className="container">
  <button onClick={finalSearch} type="submit" > <img src="https://img.icons8.com/fluency/48/000000/fry.png" alt="icon"/></button>
  </div>
</form>
</div>
<div>
  {
    myNutrition && <p>{myNutrition.calories} kcal</p>
  }
  {
    myNutrition && Object.values(myNutrition.totalNutrients)
      .map(({ label, quantity, unit }) =>
        <Nutrition key={unit}
          label={label}
          quantity={quantity}
          unit={unit}
        />
      )
  }
</div>
         
    </div>
  );
}

export default App;