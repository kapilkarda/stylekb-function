import React from 'react';
import { Link } from 'react-router-dom';

const Front = () => {
  return (
    <div className="container">    
      <div  class="offset-4 col-4 mb-2 btn-group">
        <Link to={`/mobile`} className="btn btn-primary" activeClassName="active">Mobile</Link>
        <Link to={`/tshirt`} className="btn btn-primary" activeClassName="active">T-shirt</Link>
      </div>   
    </div> 
  );
}

export default Front;
