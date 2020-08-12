const router = require('express').Router();
const { Event, Employee } = require('../../models');

// get event
router.get('/', (req, res) => {
    Event.findAll({
        attributes: ['id', 'title', 'description', 'date', 'start_time', 'end_time', 'calendar_id', 'employee_id'],
        include: [
            {
                model: Employee,
                attributes: ['firstname', 'lastname', 'email']
            }
        ]
    })
    .then(dbEventData => res.json(dbEventData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//get a single event
router.get('/:id', (req, res) => {
    Event.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'description', 'date', 'start_time', 'end_time', 'calendar_id', 'employee_id'],
        include: [
            {
                model: Employee,
                attributes: ['firstname', 'lastname', 'email']
            }
        ]
    })
    .then(dbEventData => {
        if(!dbEventData) {
            res.status(404).json({ message: 'No event found with this id' })
            return;
        }
        res.json(dbEventData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//create an event
router.post('/', (req, res) => {
    // check the session
    if (req.session) {
      Event.create({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        // use the id from the session
        employee_id: req.session.employee_id,
        calendar_id: req.body.calendar_id
    })
    .then(dbEventData => res.json(dbEventData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
}   
});

//update an event
router.put('/:id', (req, res) => {
    Event.update(
        {
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            start_time: req.body.start_time,
            end_time: req.body.end_time
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbEventData => {
        if (!dbEventData) {
          res.status(404).json({ message: 'No event found with this id' });
          return;
        }
        res.json(dbEventData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//delete an event
router.delete('/:id', (req, res) => {
    Event.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbEventData => {
        if (!dbEventData) {
            res.status(404).json({ message: 'No event found with this id' });
            return;
        }
        res.json(dbEventData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;