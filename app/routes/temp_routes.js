var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
  app.get('/tempData/:id', (req, res) => {
    console.log('go');
    const id = req.params.id;
    console.log(id);
    const details = { '_id': 'selj0s0QUVPXNxNKX3bOH1boW7wIsCzc' };
    db.collection('tempData').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });

  app.post('/tempData', (req, res) => {
    const tempData = req.body;
    db.collection('tempData').insert(tempData, (err, result) => {
      if (err) {
        res.status({ 'error': 'An error has occurred' });
      } else {
        res.status('I tried', result.ops[0]);
        console.log("you tried ", result.ops[0]);
      }
    });
  });

  /*app.put('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const note = { text: req.body.body, title: req.body.title };
    db.collection('notes').update(details, note, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(note);
      }
    });
  });

  app.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('notes').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Note ' + id + ' deleted!');
      }
    });
});*/
};
