import app from "@/app";
import { Config } from "@/config";
import { Logger } from "@/config/logger";

(() => {
  const PORT = Config.PORT;
  const HOST = Config.HOST;

  try {
    app.listen(PORT, () => {
      const host = HOST === "localhost" ? "http://localhost" : `https://${HOST}`;
      console.log(`Server is running on ${host}:${PORT}`);
      Logger.info(`Server is running on ${host}:${PORT}`);
    });
  } catch (error) {
    Logger.error(error);
    process.exit(1);
  }
})();
