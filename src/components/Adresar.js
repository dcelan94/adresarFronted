import React from 'react'

const Adresar =({korisnik,brisi})=> {
    return(
        <li className="unos">
            {korisnik.ImePrezime+ " "}
            {korisnik.Email+ " "}
            <button onClick={brisi}>Briši</button>
        </li>
    )
}
export default Adresar