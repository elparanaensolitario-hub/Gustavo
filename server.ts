import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set higher body limit to handle high-resolution book cover images in base64 format safely
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Ensure custom-covers directory exists on startup so it can survive and serve statically
  const customCoversDir = path.join(process.cwd(), "custom-covers");
  if (!fs.existsSync(customCoversDir)) {
    fs.mkdirSync(customCoversDir, { recursive: true });
  }

  // Serve custom-covers folder statically both in development and production
  app.use("/custom-covers", express.static(customCoversDir));

  // Copy over existing images from assets/images to custom-covers directory as a migration on boot if they don't already exist
  const migrationMap = {
    parana_es: "parana_es_1781302740605.jpg",
    parana_en: "parana_en_1781302753534.jpg",
    iara: "iara_cover_1781302772227.jpg",
    ingenieria_es: "ingenieria_es_1781302790428.jpg",
    ingenieria_en: "ingenieria_en_1781302803993.jpg",
    trilogia_es: "trilogia_es_1781302818937.jpg",
    trilogia_en: "trilogia_en_1781302834741.jpg"
  };

  Object.entries(migrationMap).forEach(([key, srcFile]) => {
    const srcPath = path.join(process.cwd(), "src", "assets", "images", srcFile);
    const destPath = path.join(customCoversDir, `${key}.jpg`);
    if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
      try {
        fs.copyFileSync(srcPath, destPath);
        console.log(`[Cover Engine Migration] Migrated initial cover for ${key} to ${destPath}`);
      } catch (e) {
        console.error(`Migration error for ${key}:`, e);
      }
    }
  });

  // GET endpoint to list which custom covers exist on the server
  app.get("/api/custom-covers", (req, res) => {
    try {
      if (!fs.existsSync(customCoversDir)) {
        return res.json({});
      }
      const files = fs.readdirSync(customCoversDir);
      const exists: { [key: string]: boolean } = {};
      const keys = ["parana_es", "parana_en", "iara", "ingenieria_es", "ingenieria_en", "trilogia_es", "trilogia_en"];
      keys.forEach(k => {
        const filename = `${k}.jpg`;
        if (files.includes(filename)) {
          exists[k] = true;
        }
      });
      return res.json(exists);
    } catch (e: any) {
      return res.json({});
    }
  });

  // API endpoint to receive uploaded book covers and write them directly into the src/assets/images file tree
  app.post("/api/upload-cover", (req, res) => {
    try {
      const { bookNum, lang, key, base64 } = req.body;
      if (!base64) {
        return res.status(400).json({ error: "Missing base64 data" });
      }

      // Extract raw base64 data bytes
      const matches = base64.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid base64 string format" });
      }
      const buffer = Buffer.from(matches[2], "base64");

      // Set key based on either direct key parameter or legacy bookNum/lang mapping
      let finalKey = key;
      if (!finalKey && bookNum) {
        if (bookNum === 1) {
          finalKey = lang === "en" ? "parana_en" : "parana_es";
        } else if (bookNum === 2) {
          finalKey = "iara";
        } else if (bookNum === 3) {
          finalKey = lang === "en" ? "ingenieria_en" : "ingenieria_es";
        } else if (bookNum === 4) {
          finalKey = lang === "en" ? "trilogia_en" : "trilogia_es";
        }
      }

      if (!finalKey) {
        return res.status(400).json({ error: "Missing key or bookNum" });
      }

      // Save to custom-covers directory for real-time unhashed service
      const customCoverPath = path.join(customCoversDir, `${finalKey}.jpg`);
      fs.writeFileSync(customCoverPath, buffer);
      console.log(`[Cover Engine] Saved custom cover in server-side storage: ${customCoverPath}`);

      // Map key back to Vite original filename for backward and build compatibility
      let originalFilename = "";
      if (finalKey === "parana_es") originalFilename = "parana_es_1781302740605.jpg";
      else if (finalKey === "parana_en") originalFilename = "parana_en_1781302753534.jpg";
      else if (finalKey === "iara") originalFilename = "iara_cover_1781302772227.jpg";
      else if (finalKey === "ingenieria_es") originalFilename = "ingenieria_es_1781302790428.jpg";
      else if (finalKey === "ingenieria_en") originalFilename = "ingenieria_en_1781302803993.jpg";
      else if (finalKey === "trilogia_es") originalFilename = "trilogia_es_1781302818937.jpg";
      else if (finalKey === "trilogia_en") originalFilename = "trilogia_en_1781302834741.jpg";

      if (originalFilename) {
        const originalFilePath = path.join(process.cwd(), "src", "assets", "images", originalFilename);
        const originalDir = path.dirname(originalFilePath);
        if (!fs.existsSync(originalDir)) {
          fs.mkdirSync(originalDir, { recursive: true });
        }
        fs.writeFileSync(originalFilePath, buffer);
        console.log(`[Cover Engine] Also replicated static asset file: ${originalFilePath}`);
      }

      return res.json({ success: true, key: finalKey });
    } catch (error: any) {
      console.error("[Cover Engine Error]", error);
      return res.status(500).json({ error: error.message || "Failed to write cover image to workspace" });
    }
  });

  // Serve Vite app based on Environment Mode
  if (process.env.NODE_ENV !== "production") {
    // Development mode with Vite Dev Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production compiled asset delivery
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Express server with Vite initialized on port ${PORT}`);
  });
}

startServer();
