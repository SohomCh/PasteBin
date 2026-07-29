import{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import api from '../services/api'
function CreatePaste() {

    const[content,setContent]=useState("");
    const[isPublic,setIsPublic]=useState(true);
    const[expiry,setExpiry]=useState("");
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
        const token=localStorage.getItem('token');{}
        console.log(token)
        console.log(expiry)
        console.log(typeof expiry)
        const response=await api.post(
            "/paste",
            {
                content,
                isPublic,
                expiry,
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                },
            }
        );
        alert("Paste Created Successfully")
        
        console.log(response.data);
        navigate('/my-pastes');
    
}
catch (error) {
    console.log("Entire Error:", error);
    console.log("Response:", error.response);
    console.log("Request:", error.request);
    console.log("Message:", error.message);

    if (error.response) {
        console.log("Response Data:", error.response.data);
    }

    alert("Failed to Create Paste");
}

  
};


    return (
        <div>
        <h1>Create Paste Page</h1>
        <form onSubmit={handleSubmit}>
            <div>
            <label>Content</label>
            <br/>
            <textarea
                    rows="10"
                    cols="60"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                </div>

                <br/>
                <div>
                    <label>Expiry</label>
                    <br/>
                    <input type='date'
                            value={expiry}
                            onChange={(e)=>setExpiry(e.target.value)}
                            
                            />
                </div>



                <br/>
                <button type="Submit">Create Paste</button>



        </form>


        </div>
    )
};

export default CreatePaste;