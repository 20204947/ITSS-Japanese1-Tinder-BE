const Event = require('../models/event');
const { Op } = require('sequelize');

exports.getEvent = async (req, res) => {
    let { eventName, limit, offset, ...rest} = req.query;
    if (limit) {
        limit = parseInt(limit, 10)
    }
    try {
        const listEvent = await Event.findAndCountAll({
          where: {eventName:{
            [Op.like]: `%${eventName}%`
          }, active: true},
          limit: limit,
          offset: offset
        })
        
        return res.status(200).json({count: listEvent.count, data: listEvent.rows, limit, offset});
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};


exports.createEvent = async (req, res) => {
    const { eventName, eventTime, eventDescription } = req.body;

    try {
        const event = await Event.create({eventName, eventTime, eventDescription})

        if (!event) {
            return res.status(401).json({ message: 'error on create event' });
        }

        res.status(200).json({ message: 'Create event successful', event });
    } catch (err) {
        res.status(500).json({ message: 'Error create event in', error: err.message });
    }
};


// Lấy thông tin người dùng
exports.updateEvent = async (req, res) => {
    const { eventID, eventName, eventTime, eventDescription } = req.body;
    
    try {
        const event = await Event.update(
            {
                eventName, eventTime, eventDescription
            }, 
            {
                where: {eventID}
            }
        );

        if (!event) {
            return res.status(401).json({ message: 'error on update event' });
        }
        
        res.status(200).json({ message: 'Update event successful', event });
    } catch (err) {
        res.status(500).json({ message: 'Error update event in', error: err.message });
    }
};

// Soft delete event
exports.unlinkEvent = async (req, res) => {
    const { eventID } = req.body;

    try {
        const event = await Event.update(
            {
                active: false
            }, 
            {
                where: {eventID}
            }
        );

        if (!event) {
            return res.status(401).json({ message: 'error on update event' });
        }
        
        res.status(200).json({ message: 'Update event successful', event });
    } catch (err) {
        res.status(500).json({ message: 'Error update event in', error: err.message });
    }
};