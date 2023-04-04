import React from 'react';
export const UserContext = React.createContext(null);

export function Card(props){
   
    function classes(){
      //const bg  = props.bgcolor ? ' bg-' + props.bgcolor : ' ';
      const txt = props.txtcolor ? ' text-' + props.txtcolor: ' text-white';
      return 'card mb-3 ' + txt;
    }
    function styles(){
      let baseStyles = {
        maxWidth:"25rem"
      }
      const newStyles = {};
      if(props.bgcolor) { newStyles.backgroundColor = props.bgcolor;} 
      if(props.width) {
        delete baseStyles['maxWidth'];
        newStyles.width=props.width;
      }
      baseStyles={...baseStyles,...newStyles};
      return baseStyles
    }
  
    return (
      <div className={classes()} style={styles()}>
        <h3 className="card-header">{props.header}</h3>
        <div className="card-body">
          {props.title && (<h5 className="card-title">{props.title}</h5>)}
          {props.text && (<p className="card-text">{props.text}</p>)}
          {props.body}
          {props.status && (<div id='createStatus'>{props.status}</div>)}
        </div>
      </div>      
    );    
  }