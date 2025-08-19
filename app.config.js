export default {
  expo: {
    extra: {
      malApiUrl: process.env.EXPO_MAL_BASE_URL,
      clientId: process.env.EXPO_PERSONAL_CLIENT_ID,
      backendUrl: process.env.DEV_ENDPOINT,
    },
    android: {
      package: "com.noelams.anibox",
    },
  },
};
