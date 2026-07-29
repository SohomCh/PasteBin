import{useState} from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from"../services/api"
import { useParams } from "react-router-dom";

function ViewPaste() {

    const { id } = useParams();

    const [paste, setPaste] = useState(null);
    useEffect(()=>{
        fetchPaste();
    }
,[])

async function fetchPaste(){
    try{
        const token=localStorage.getItem("token")
      const response= await api.get(
            `/paste/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        console.log(response.data)
        setPaste( response.data.data)
        


        
    }
    catch(error){

        console.log(error);
        alert("Failed to fetch");

    }
}



    return (
    <div>

        <h1>View Paste</h1>

        {!paste ? (
            <h2>Loading...</h2>
        ) : (

            <div>

                <p>
                    <strong>Paste ID :</strong> {paste.pasteId}
                </p>

                <p>
                    <strong>Content :</strong>
                </p>

                <textarea
                    rows="10"
                    cols="60"
                    value={paste.content}
                    readOnly
                />

                <br />
                <br />

                <p>
                    <strong>Views :</strong> {paste.views}
                </p>

                <p>
                    <strong>Public :</strong> {paste.isPublic ? "Yes" : "No"}
                </p>

                <p>
                    <strong>Expiry :</strong>{" "}
                    {paste.expiresAt
                        ? new Date(paste.expiresAt).toLocaleDateString()
                        : "Never"}

                </p>

            </div>

        )}

    </div>
);
}

export default ViewPaste