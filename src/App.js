
import React, { useState, useEffect } from 'react'
import Adresar from './components/Adresar'
import adresarServer from './services/adresar'



const App = (props) => {
  const [identitet,postaviId]=useState(0)
  const [adresar, postaviUnos] = useState([])
  const [unosImePrezime, postaviIme] = useState("")
  const [unosAdrese, postaviAdresu] = useState("")
  const [ispisiSve, postaviIspis] = useState(true)
  const [unosFiltera,postaviFilter]=useState("")
  const [uredi,postaviSignal]=useState(false)

  useEffect(()=>{
    console.log("Effect hook");
    adresarServer.dohvatiSve().then(response=>{
      console.log("Kontakti dohvaćeni");
      postaviUnos(response.data);
    })
  },[])

 const porukeZaIspis = ispisiSve ? adresar :adresar.filter(p => p.ImePrezime.split(" ")[0]===unosFiltera)


  const noviKorisnik = (e) => {
    e.preventDefault()
    console.log("Klik", e.target);
    const noviObjekt = {           
        ImePrezime: unosImePrezime,
        Adresa: unosAdrese
    }

    if(!uredi){
      adresarServer.stvori(noviObjekt).then(
        (response) =>{
          console.log(response)
          postaviUnos(adresar.concat(response.data))
          postaviIme('')
          postaviAdresu('')
        })
    }
    else{
      const korisnik=adresar.find(p => p.id === identitet)

      const novi={
        ...korisnik,
        ImePrezime:unosImePrezime,
        Email:unosAdrese
      }
      adresarServer.osvjezi(identitet,novi)
      .then((response) => {
        console.log(response);
        postaviUnos(adresar.map(p => p.id!==identitet ? p:response.date))
        postaviAdresu('')
        postaviIme('')
        postaviSignal(false);
      })
    }
  }

  const promjenaImena = (e) => {
    console.log(e.target.value);
    postaviIme(e.target.value)
  }


  const promjenaAdrese = (e) => {
    console.log(e.target.value);
    postaviAdresu(e.target.value)
}

const promjenaFiltera = (e) => {
  console.log(e.target.value);
  postaviFilter(e.target.value)
}

const uredivanje=(id)=>{
  postaviSignal(true);
  postaviId(id);
  const korisnik=adresar.find(p => p.id ===id)
  postaviIme(korisnik.ImePrezime);
  postaviAdresu(korisnik.Email);
 
  }

const brisanjeKorisnika=(id)=>{
  adresarServer.brisi(id)
  .then(response=>{
  console.log(response);
  postaviUnos(adresar.filter(p=>p.id!==id))
})
}
return (
  <div>
      <h1>Adresar</h1>
      <div>
        <p>Filtriraj osobe</p>
        <input value={unosFiltera} onChange={promjenaFiltera}/>
      </div>
        
        <ul>
              {porukeZaIspis.map( korisnik =>
              <Adresar 
              key={korisnik.id}
              korisnik={korisnik} 
              urediKorisnika ={() => uredivanje(korisnik.id)}
              brisiKorisnika ={()=>brisanjeKorisnika(korisnik.id)}/>
              )}
        </ul>

          
          <h2>Novi korisnik</h2>
          <form onSubmit={noviKorisnik}>
                <label>Ime i prezime:</label>
                <input value={unosImePrezime} onChange={promjenaImena} /><br></br><br></br>
                <label>E-mail adresa:</label>
                <input  value={unosAdrese} onChange={promjenaAdrese} /><br></br><br></br>
                <button type="submit">Spremi</button>
             
      </form>
</div>


)
}
 
export default App