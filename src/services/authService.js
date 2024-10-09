const BACKEND_URL = import.meta.env.VITE_CHILDCARE_BACKEND_URL;

const signup = async (FormData) => {
    try {
        const res = await fetch(`${BACKEND_URL}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(FormData),
        });
        const json = await res.json();
        if (json.error) {
            throw new Error(json.err);
        }
        return json;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export {
    signup,
}
