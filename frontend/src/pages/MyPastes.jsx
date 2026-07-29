import { useState } from "react"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import api from "../services/api"



function MyPastes() {
    const[pastes,setPastes]=useState([]);

    useEffect(()=>{
        fetchPastes();
    },[])


    async function fetchPastes(){

        try{

            const token=localStorage.getItem("token");

            const response=await api.get(
                "/paste/my",
                {
                    headers:{
                        Authorization :`Bearer ${token}`


                        }
                }
            );
            console.log(response.data)
            setPastes(response.data.data);
            console.log(pastes);

        }
    
    catch(error){
        console.log(error);
        alert("Failed to fetch")
    }
    }


    
    async function handleDelete(id) {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this paste?"
    );

    if (!confirmDelete) return;

    try {

        const token = localStorage.getItem("token");

        await api.delete(
            `/paste/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setPastes((prevPastes) =>
    prevPastes.filter((paste) => paste.pasteId !== id)
);

        // Remove deleted paste from UI
        setPastes((prevPastes) =>
            prevPastes.filter((paste) => paste.pasteId !== id)
        );

    }
    catch (error) {

        console.log(error);
        alert("Failed to delete paste");

    }

}
   const navigate=useNavigate()
    return (
        
        <>
     
    <div>
        <h1>My Pastes</h1>
{pastes.map((paste) => (
    <div key={paste._id}>
        <h3>{paste.pasteId}</h3>

        <button
            onClick={() => navigate(`/paste/${paste.pasteId}`)}
        >
            View
        </button>
        <button
            onClick={()=>navigate(`/edit/${paste.pasteId}`)}
            >Edit</button>


            <button
    onClick={() => handleDelete(paste.pasteId)}
>
    Delete
</button>
    </div>
))}
    </div>

        
        </>
    )
}

export default MyPastes