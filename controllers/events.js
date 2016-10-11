var
  User = require('../models/User.js'),
  Event = require('../models/Event.js')
module.exports = {

    index: function(req, res) {
        User.findById(req.params.id).populate('intEvents').exec(function(err, user) {
            //res.json(user.intEvents)
            res.render('intEvents', {events: user.intEvents})
        })

    },
    create: function(req, res) {
      console.log("Entering create");
        User.findById(req.params.id, function(err, user) {
          console.log(err);
          console.log("User body is"+ user);
            var newEvent = new Event(req.body)
            newEvent._by = user._id
            console.log("Event is"+ newEvent);
                //populated _by with User Id
            newEvent.save(function(err) {
              console.log("saving new event");
                if (err) return console.log(err)
                user.intEvents.push(newEvent)
                console.log("pushing new event");
                user.save(function(err) {
                  console.log("saving event");
                    res.json(user)
                    console.log("saving new shfdkjdhfkjdshfkdsa");
                })
            })
        })
    },

    show: function(req, res) {
        Event.findById(req.params.id, function(err, eventdata) {
            if (err) return console.log(err)
            res.json(eventdata)
        })
    },
    update: function(req, res) {
        Event.findByIdAndUpdate(req.params.id, req.body, {new: true},
            function(err, event) {
            res.json({message: "Event updated!", event:event})
        })
    },
    destroy: function(req, res){
         Event.findByIdAndRemove(req.params.id, function(err){
           if(err) return console.log(err)
           User.findById(req.user._id, function(err, user){
             if(err) return console.log(err)
             user.update({$pull: {paths: req.params.id}}, function(err){
               if(err) return console.log(err)
               res.redirect('/hub')
             })
           })
         })
     },
}
