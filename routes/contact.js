export default async function (server, opts) {
  server.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.code(400).send({ message: "All fields are required" });
      return;
    }

    req.log.info(`📩 Contact Form Submission:
      Name: ${name}
      Email: ${email}
      Message: ${message}
      `);

    res.send({ message: "Message received successfully" });
  });
}
