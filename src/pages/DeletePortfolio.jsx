import { useState } from "react";

function DeletePortfolio() {
  

  const [apiID, setApiID] = useState({
    id: "",
  });

 
 const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setApiID({
      ...apiID,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
  const data = new FormData();
  data.append("portfolio", JSON.stringify(form));
  data.append("file", imageFile);

};

  return (
    <div className="pagePadding">

      <h2 className="submittedLabel">Delete your Portfolio!</h2>

<div className="uploadSection">
          
          </div>
      
        <div className="formSection">

            <label>
            ID: 
            <input 
              type="text" 
              name="portfolioId" 
              value={apiID.id} 
              onChange={handleChange} 
            />
          </label>

          <div className="buttonRow">
        <button className="mainDesignBtn" onClick={handleSubmit}>Delete</button>
      </div>
        </div>

    </div>
  );
}

export default DeletePortfolio;
