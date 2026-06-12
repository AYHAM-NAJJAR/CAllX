import axios from "axios";
import { BASE_URL, fieldDifenition } from "../Api/endpoints";

export const createFieldDefinition = async (data) => {

    try {

        // جلب التوكن من localStorage
        const token = localStorage.getItem("Token");

        const response = await axios.post(
            `${BASE_URL}${fieldDifenition}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",

                    // إضافة Authorization Header
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;

    } catch (error) {

        console.error("Create Field Error:", error);

        throw error;
    }
};