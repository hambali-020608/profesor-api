const { justtalk } = require("../services/movie.service");

exports.justtalkLatest = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const data = await justtalk.latestMovies(page);
    return res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching latest movies:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.justtalkMovies = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const data = await justtalk.Movies(page);
    return res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.justtalkStreaming = async (req, res) => {
  try {
    const slug = req.query.slug;
    if (!slug) {
      return res.status(400).json({ success: false, message: "Slug is required" });
    }

    console.log("Streaming slug:", slug);
    const data = await justtalk.streaming(slug);
    return res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching streaming data:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.justtalkSearch = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    const data = await justtalk.search(query);
    return res.json({ success: true, data });
  } catch (error) {
    console.error("Error searching movies:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
