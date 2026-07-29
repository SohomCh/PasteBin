import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditPaste() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    async function fetchPaste() {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(
                `/paste/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setContent(response.data.data.content);
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            alert("Failed to fetch paste");
        }
    }

    async function handleUpdate() {
    try {

        const token = localStorage.getItem("token");

        await api.patch(
            `/paste/${id}`,
            {
                content: content
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert("Paste updated successfully!");

        navigate("/mypastes");

    } catch (error) {

        console.log(error);
        alert("Failed to update paste");

    }
}

    useEffect(() => {
        fetchPaste();
    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>
            <h1>Edit Paste</h1>

            <textarea
                rows="10"
                cols="60"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <br />
            <br />

            <button onClick={handleUpdate}>
                Save Changes
            </button>
        </div>
    );
}

export default EditPaste;