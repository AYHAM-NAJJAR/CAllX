// utils/jwt.js

export const extractEmailFromToken = (token) => {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    return payload.sub || "";
  } catch (e) {
    console.error("JWT Parse Error", e);
    return "";
  }
};