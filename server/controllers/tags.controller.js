exports.getTags = (req, res) => {
    const tagsQuery = "SELECT id, name FROM tags";
    db.query(tagsQuery, (err, data) => {
      if (err) { return res.status(500).send(err); }
      return res.json(data);
    });
}