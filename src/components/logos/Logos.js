import ibs from "./../../img/icons/ibs.png";
import sfedu from "./../../img/icons/sfedu.png";

function Logos () {
    return (

    <div className="logos-container">
        <img src={sfedu} alt="sfedu" className="small-logo"/>
        <img src={ibs} className="small-logo"/>
    </div>
    );
}

export default Logos;