import { XRapidAPIHost } from "./api";
import { XRapidAPIHostNews } from "./api";
import { XRapidAPIKey } from "./api";
import axios from "axios";

//Endpoints

const apiBaseUrl = "https://coinranking1.p.rapidapi.com";
const newsBaseUrl = "https://cryptocurrency-news2.p.rapidapi.com"
const coinsUrl = `${apiBaseUrl}/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0`;

const newsUrl = `${newsBaseUrl}/v1/bsc`
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

const NewsApiCall = async (endpoints) => {
    const options = {
        method: "GET",
        url: endpoints,
        headers: {
            "X-RapidAPI-Key": `${XRapidAPIKey}`,
            "X-RapidAPI-Host": `${XRapidAPIHostNews}`,
        },
    };
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error("NewsApiCall Error:", {
            message: error.message,
            response: error.response?.data || "No response data",
        });
        return {};
    }
};

export const FetchAllCoins = async ()=>{
    return await CryptoApiCall(coinsUrl)
}
export const FetchCoinDetails = async (coinUuid) => {
    const endpoints = `${apiBaseUrl}/coin/${coinUuid}?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h`;
    return await CryptoApiCall(endpoints);
};

export const FetchCoinHistory = async (coinUuid) => {
    const endpoints = `${apiBaseUrl}/coin/${coinUuid}/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h`;
    return await CryptoApiCall(endpoints);
};

export const SearchCoin = async (search) => {
    const endpoints = `${apiBaseUrl}/search-suggestions?referenceCurrencyUuid=yhjMzLPhuIDl&query=${search}`;
    try {
        const response = await CryptoApiCall(endpoints);
        console.log("API Response:", response); // Kiểm tra phản hồi từ API
        return response;
    } catch (error) {
        console.error("Error in SearchCoin:", error);
        throw error; // Đảm bảo bắt lỗi nếu có vấn đề
    }
};
export const FetchCryptoNews = async (params) => {
    return await NewsApiCall(newsUrl)
}