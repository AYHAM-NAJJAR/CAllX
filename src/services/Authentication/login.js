import { login } from "../Api/endpoints"; // فقط نستورد المسار الفرعي
import api from "../Api/api"; // النسخة المراقبة

export const LoginOperation = async (loginInfo) => {
    try {
        
        let response = await api.post(login, {
            email: loginInfo.email,
            password: loginInfo.password,
        });

        if (response.status === 200 || response.status === 201) {
            const token = response.data.data.token;
            localStorage.setItem("Token", token);
            return { 
                success: true, 
                message: response.data.message, 
                user: response.data.data.user 
            };
            
        }
        
        return { success: false, message: `Unexpected status (${response.status})` };
        
    } catch (err) {
        if (err) {
            return { 
            success: false, 
            message: "Login failed. Please check your credentials." 
        };    
        }
        
    }
};