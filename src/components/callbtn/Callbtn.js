import { Link } from 'react-router-dom';

const Callbtn = () => {
  return (
    <div className="callback-button-container">
      <Link to="/call" className="callback-button">
        ЗАКАЗАТЬ ЗВОНОК
      </Link>
    </div>
  );
};

export default Callbtn;