import { API_URL } from './config'

export const predictImages = async(formData) => {
    const res = await fetch(`${API_URL}/imageclassifier/predict`, { method: 'POST', body: formData })

    if (!res.ok) {
        throw [await res.json()];
    }

    const jsonRes = await res.json();

    if (res.ok) {
        return jsonRes;
    } else {
        throw jsonRes;
    }
}