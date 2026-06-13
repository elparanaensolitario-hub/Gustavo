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

  // API endpoint to receive uploaded book covers and write them directly into the src/assets/images file tree
  app.post("/api/upload-cover", (req, res) => {
    try {
      const { bookNum, lang, base64 } = req.body;
      if (!bookNum || !base64) {
        return res.status(400).json({ error: "Missing bookNum or base64 data" });
      }

      // Extract raw base64 data bytes
      const matches = base64.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid base64 string format" });
      }
      const buffer = Buffer.from(matches[2], "base64");

      // Map book number and language to its real built-in JPG asset filename
      let filename = "";
      if (bookNum === 1) {
        filename = lang === "en" ? "parana_en_1781302753534.jpg" : "parana_es_1781302740605.jpg";
      } else if (bookNum === 2) {
        filename = "iara_cover_1781302772227.jpg";
      } else if (bookNum === 3) {
        filename = lang === "en" ? "ingenieria_en_1781302803993.jpg" : "ingenieria_es_1781302790428.jpg";
      } else if (bookNum === 4) {
        filename = lang === "en" ? "trilogia_en_1781302834741.jpg" : "trilogia_es_1781302818937.jpg";
      }

      if (!filename) {
        return res.status(400).json({ error: "Unknown book identifier" });
      }

      const filePath = path.join(process.cwd(), "src", "assets", "images", filename);
      
      // Ensure the target folder exists (though we know it does)
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write direct bytes to file to override the default template images permanently
      fs.writeFileSync(filePath, buffer);
      console.log(`[Cover Engine] Saved custom cover image for Book ${bookNum} (${lang || "es"}) directly to ${filePath}`);

      return res.json({ success: true, path: filePath, filename });
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
