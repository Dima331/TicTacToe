exports.addRoom = (req, res) => {
    const { roomId, tags } = req.body;
    if (!req.body) { return res.status(400).send("No data"); }
    const roomFindQuery = "SELECT * FROM tictac WHERE room=?";
    const setRoomIdQuery = "INSERT INTO tictac (room, steps) VALUES (?, ?)";

    db.query(roomFindQuery, [roomId], async (err, data) => {
        if (err) { return res.status(500).send(err); }
        let returnArr = []
        if (!data.length || data.length === 0) {
            const steps = Array(9).fill(null).toString()
            db.query(setRoomIdQuery, [roomId, steps], async (err, data) => {
                if (err) { return res.status(500).send(err); }
                let idRoom = data.insertId;
                let tagsNotHaveId = [];
                let tagsHaveId = [];
                for (let val of tags) {
                    if (!val.id) {
                        tagsNotHaveId.push(val.name);
                    } else {
                        tagsHaveId.push(val.id);
                    }
                }
                const tagsQuery = "INSERT INTO tags (name) VALUES (?)";
                for (let i = 0; i < tagsNotHaveId.length; i++) {
                    await new Promise((res, rej) => {
                        db.query(tagsQuery, [tagsNotHaveId[i]], (err, data) => {
                            if (err) return rej(err);
                            res(data);
                            returnArr.push(data.insertId);
                        });
                    });
                }
                const tmpQA = [...tagsHaveId, ...returnArr];
                const tagsToGameQuery = "INSERT INTO tictac_to_tags (id_game, id_tag) VALUES (?, ?)";
                for (let i = 0; i < tmpQA.length; i++) {
                    await new Promise((res, rej) => {
                        db.query(tagsToGameQuery, [idRoom, tmpQA[i]], async (err, data) => {
                            if (err) return rej(err);
                            res(data);
                        })
                    });
                }
            });
            return res.json({ message: 'add' });
        } else {
            return res.json({ message: 'have' });
        }
    })
}


exports.deleteRoom = (req, res) => {
    const { roomId } = req.body;
    const deleteRoomQuery = 'DELETE FROM tictac WHERE room=?';
    db.query(deleteRoomQuery, [roomId], (err, data) => {
        if (err) { return res.status(500).send(err); }
        return res.json(data);
    });
}

exports.getRooms = (req, res) => {
    const test = "SELECT tictac.room, tags.name FROM `tictac` INNER JOIN `tictac_to_tags` ON tictac.id=tictac_to_tags.id_game INNER JOIN `tags` ON tags.id=tictac_to_tags.id_tag;";
    db.query(test, (err, data) => {
        if (err) { return res.status(500).send(err); }
        let output = data.reduce(function (item, i) {
            let occurs = item.reduce(function (n, item, i) {
                return (item.room === i.room) ? i : n;
            }, -1);
            if (occurs >= 0) {
                item[occurs].name = item[occurs].name.concat(i.name);
            } else {
                let obj = { room: i.room, name: [i.name] };
                item = item.concat([obj]);
            }
            return item;
        }, []);
        return res.json(output);
    });
}
exports.checkRooms = (req, res) => {
    const { roomId } = req.body;
    if (!req.body) { return res.status(400).send("No data"); }
    const roomFindQuery = "SELECT * FROM tictac WHERE room=?";
    const setRoomIdQuery = "INSERT INTO tictac (room, steps) VALUES (?, ?)";

    db.query(roomFindQuery,
        [roomId], async (err, data) => {
            if (err) { return res.status(500).send(err); }

            if (!data.length || data.length === 0) {
                const steps = Array(9).fill(null).toString();
                db.query(setRoomIdQuery,
                    [roomId, steps], (err, data) => {
                        if (err) { return res.status(500).send(err); }
                        return res.json({ message: 'add' });
                    });
            } else {
                return res.json({ message: 'have' });
            }
        })
}


exports.searchRooms = (req, res) => {
    const { roomId } = req.body;
    if (!req.body) { return res.status(400).send("No data"); }
    const roomFindQuery = "SELECT * FROM tictac WHERE room=?";
    db.query(roomFindQuery,
        [roomId], async (err, data) => {
            if (err) { return res.status(500).send(err); }
            if (data[0]) {
                return res.json(data[0]);
            }
            return res.json({ message: 'not have' });
        })
}