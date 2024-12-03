import { XRapidAPIHost } from "./api";
import { XRapidAPIHostNews } from "./api";
import { XRapidAPIKey } from "./api";
import axios from "axios";

//Endpoints

const apiBaseUrl = "https://coinranking1.p.rapidapi.com";

const coinsUrl = `${apiBaseUrl}/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0`;

const CryptoApiCall = async (endpoints, params) =>{
    const options = {
        method: "GET",
        url: endpoints,
        params: params ? params: {},
        headers: {
            "X-RapidAPI-Key":`${XRapidAPIKey}`,
            "X-RapidAPI-Host":`${XRapidAPIHost}`,
        },
    };
    try {
        const response = await axios.request(options)
        return response.data
    } catch (error) {
        console.log(error)
        return {}
    }
}

export const FetchAllCoins = async ()=>{
    return await CryptoApiCall(coinsUrl)
}